import mysql, { Pool, PoolConnection, RowDataPacket } from "mysql2/promise";
import dotenv from "dotenv";

import { DbNode } from "../../Domain/models/DbNode";
import { NodeStatus } from "../../Domain/enums/nodes/NodeStatus";
import { DbNodeRole } from "../../Domain/enums/nodes/DbNodeRole";
import {
  HEALTH_CHECK_TIMEOUT,
  HEALTH_CHECK_INTERVAL_MS,
} from "../../Domain/constants/Constants";
import { ILoggerService } from "../../Domain/services/logger/ILoggerService";
import { DbMessages } from "../../Domain/constants/messages/db/DbMessages";
import { DbLogMessages } from "../../Domain/constants/messages/db/DbLogMessages";

dotenv.config();

export type DbNodeHealthSnapshot = {
  node: DbNode;
  role: DbNodeRole;
  canServeReads: boolean;
};

export type DbFailoverReason = "automatic" | "manual";

export type DbFailoverEvent = {
  reason: DbFailoverReason;
  oldMasterName: string;
  oldMasterHost: string;
  oldMasterPort: number;
  newMasterName: string;
  newMasterHost: string;
  newMasterPort: number;
  occurredAt: Date;
};

export type DbFailoverListener = (
  event: DbFailoverEvent,
) => Promise<void> | void;

type DbConnectionResult = {
  conn: PoolConnection;
  nodeName: string;
};

interface NodeInfo {
  name: string;
  pool: Pool;
  node: DbNode;
  canServeReads: boolean;
}

type MasterStatus = {
  file: string;
  position: number;
};

const DB_NAME = process.env.DB_NAME ?? "pulse_net_db";
const REPLICATION_USER = process.env.DB_REPLICATION_USER ?? "replicator";
const REPLICATION_PASSWORD = process.env.DB_REPLICATION_PASSWORD ?? "repl1234";

const createPool = (
  host: string,
  port: number,
  user: string,
  password: string,
  database: string,
): Pool =>
  mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: HEALTH_CHECK_TIMEOUT,
  });

const masterPool: Pool = createPool(
  process.env.DB_MASTER_HOST ?? "localhost",
  parseInt(process.env.DB_MASTER_PORT ?? "3306", 10),
  process.env.DB_MASTER_USER ?? "root",
  process.env.DB_MASTER_PASSWORD ?? "",
  process.env.DB_MASTER_NAME ?? DB_NAME,
);

const slave1Pool: Pool = createPool(
  process.env.DB_SLAVE1_HOST ?? "localhost",
  parseInt(process.env.DB_SLAVE1_PORT ?? "3307", 10),
  process.env.DB_SLAVE1_USER ?? "root",
  process.env.DB_SLAVE1_PASSWORD ?? "",
  process.env.DB_SLAVE1_NAME ?? DB_NAME,
);

const slave2Pool: Pool = createPool(
  process.env.DB_SLAVE2_HOST ?? "localhost",
  parseInt(process.env.DB_SLAVE2_PORT ?? "3308", 10),
  process.env.DB_SLAVE2_USER ?? "root",
  process.env.DB_SLAVE2_PASSWORD ?? "",
  process.env.DB_SLAVE2_NAME ?? DB_NAME,
);

export class DbManager {
  private currentMaster: NodeInfo;
  private readonly slaves: NodeInfo[];

  private slaveRrIndex: number = 0;
  private healthTimer: NodeJS.Timeout | null = null;

  private failoverInProgress: boolean = false;
  private readonly failoverListeners: DbFailoverListener[] = [];

  private promotedMasterRecoveryStatus: MasterStatus | null = null;

  public constructor(private readonly logger: ILoggerService) {
    this.currentMaster = {
      name: "master",
      pool: masterPool,
      canServeReads: false,
      node: new DbNode(
        "master",
        process.env.DB_MASTER_HOST ?? "localhost",
        parseInt(process.env.DB_MASTER_PORT ?? "3306", 10),
        process.env.DB_MASTER_REPLICA_HOST ?? "mysql-master",
      ),
    };

    this.slaves = [
      {
        name: "slave1",
        pool: slave1Pool,
        canServeReads: true,
        node: new DbNode(
          "slave1",
          process.env.DB_SLAVE1_HOST ?? "localhost",
          parseInt(process.env.DB_SLAVE1_PORT ?? "3307", 10),
          process.env.DB_SLAVE1_REPLICA_HOST ?? "mysql-slave1",
        ),
      },
      {
        name: "slave2",
        pool: slave2Pool,
        canServeReads: true,
        node: new DbNode(
          "slave2",
          process.env.DB_SLAVE2_HOST ?? "localhost",
          parseInt(process.env.DB_SLAVE2_PORT ?? "3308", 10),
          process.env.DB_SLAVE2_REPLICA_HOST ?? "mysql-slave2",
        ),
      },
    ];
  }

  public async init(): Promise<void> {
    await this.runHealthCheck();

    this.healthTimer = setInterval(
      () => void this.runHealthCheck(),
      HEALTH_CHECK_INTERVAL_MS,
    );
  }

  public stop(): void {
    if (this.healthTimer) {
      clearInterval(this.healthTimer);
      this.healthTimer = null;
    }
  }

  public isFailoverInProgress(): boolean {
    return this.failoverInProgress;
  }

  public isWriteAvailable(): boolean {
    return this.getWriteUnavailableMessage() === null;
  }

  public getWriteUnavailableMessage(): string | null {
    if (this.failoverInProgress) {
      return DbMessages.failoverInProgress;
    }

    if (this.currentMaster.node.status === NodeStatus.OFFLINE) {
      return DbMessages.writeUnavailable;
    }

    return null;
  }


  public registerFailoverListener(listener: DbFailoverListener): void {
    this.failoverListeners.push(listener);
  }

  public getNodeHealthSnapshots(): DbNodeHealthSnapshot[] {
    return [
      {
        node: this.currentMaster.node,
        role: DbNodeRole.MASTER,
        canServeReads: this.currentMaster.node.status !== NodeStatus.OFFLINE,
      },
      ...this.slaves.map((slave) => ({
        node: slave.node,
        role: DbNodeRole.SLAVE,
        canServeReads:
          slave.canServeReads && slave.node.status !== NodeStatus.OFFLINE,
      })),
    ];
  }

  public getSlaveRrIndex(): number {
    return this.slaveRrIndex;
  }

  public async runHealthCheck(): Promise<void> {
    await Promise.all(
      [this.currentMaster, ...this.slaves].map((node) =>
        this.checkNode(node),
      ),
    );

    this.logger.info(
      "DB",
      [this.currentMaster, ...this.slaves]
        .map((node) => `${node.name}=${node.node.status}`)
        .join(" | "),
    );

    await this.handleAutomaticMasterFailover();
    await this.handleRecoveredReplicaRejoin();
  }

  public async getWriteConnection(): Promise<DbConnectionResult | null> {
    if (this.failoverInProgress) {
      this.logger.warn("DB", DbLogMessages.writeBlockedFailoverInProgress);
      this.currentMaster.node.failedWrites++;
      return null;
    }

    if (this.currentMaster.node.status === NodeStatus.OFFLINE) {
      this.currentMaster.node.failedWrites++;

      this.logger.error("DB", DbLogMessages.masterOfflineWriteNotPossible);

      return null;
    }

    try {
      const conn = await this.currentMaster.pool.getConnection();

      this.currentMaster.node.successfulWrites++;

      return {
        conn,
        nodeName: this.currentMaster.name,
      };
    } catch (err) {
      this.currentMaster.node.status = NodeStatus.OFFLINE;
      this.currentMaster.node.failedWrites++;

      this.logger.error(
        "DB",
        DbLogMessages.failedToConnectToMaster,
        err instanceof Error ? err : null,
      );

      return null;
    }
  }

  public async getReadConnection(): Promise<DbConnectionResult | null> {
    const readableSlaves = this.slaves.filter((slave) => slave.canServeReads);

    const healthySlaves = readableSlaves.filter(
      (slave) => slave.node.status === NodeStatus.HEALTHY,
    );

    const degradedSlaves = readableSlaves.filter(
      (slave) => slave.node.status === NodeStatus.DEGRADED,
    );

    const candidates =
      healthySlaves.length > 0 ? healthySlaves : degradedSlaves;

    const slaveConnection = await this.tryGetSlaveReadConnection(candidates);

    if (slaveConnection) {
      return slaveConnection;
    }

    this.logger.warn("DB", DbLogMessages.noReadableSlavesFallbackMaster);

    return this.getMasterReadConnection();
  }

  public async triggerFailover(): Promise<DbNode | null> {
    return this.failoverToPreferredSlave("manual");
  }

  public async promoteSlaveToMaster(
    slaveIndex: number,
    reason: DbFailoverReason,
  ): Promise<DbNode | null> {
    if (this.failoverInProgress) {
      this.logger.warn("DB", DbLogMessages.failoverAlreadyInProgress);
      return null;
    }

    const targetSlave = this.slaves[slaveIndex];

    if (!targetSlave) {
      this.logger.error(
        "DB",
        `Failover failed - slave index ${slaveIndex} not found`,
      );

      return null;
    }

    if (targetSlave.node.status !== NodeStatus.HEALTHY) {
      this.logger.error(
        "DB",
        `Failover failed - target slave ${targetSlave.name} is not healthy`,
      );

      return null;
    }

    if (!targetSlave.canServeReads) {
      this.logger.error(
        "DB",
        `Failover failed - target slave ${targetSlave.name} is not ready for promotion`,
      );

      return null;
    }

    this.failoverInProgress = true;

    const oldMaster = this.currentMaster;
    let event: DbFailoverEvent | null = null;

    try {
      const promotedPrepared = await this.preparePromotedMaster(targetSlave);

      if (!promotedPrepared) {
        this.logger.error(
          "DB",
          `Failover failed - could not prepare ${targetSlave.name} as master`,
        );

        return null;
      }

      const promotedStatus = await this.getMasterStatus(targetSlave);
      if (!promotedStatus) {
        this.logger.error(
          "DB",
          `Failover failed - could not read binlog position from ${targetSlave.name}`,
        );

        return null;
      }

      this.promotedMasterRecoveryStatus = promotedStatus;

      const oldSlaves = this.slaves.filter(
        (slave) => slave.name !== targetSlave.name,
      );

      targetSlave.canServeReads = false;
      this.currentMaster = targetSlave;

      this.slaves.length = 0;

      for (const slave of oldSlaves) {
        const reconfigured = await this.reconfigureReplica(
          slave,
          this.currentMaster,
          promotedStatus,
        );

        slave.canServeReads = reconfigured;

        this.slaves.push(slave);
      }

      if (oldMaster.node.status === NodeStatus.HEALTHY) {
        const oldMasterReconfigured = await this.reconfigureReplica(
          oldMaster,
          this.currentMaster,
          promotedStatus,
        );

        oldMaster.canServeReads = oldMasterReconfigured;
      } else {
        oldMaster.canServeReads = false;
      }

      this.slaves.push(oldMaster);

      this.slaveRrIndex = 0;

      event = {
        reason,
        oldMasterName: oldMaster.name,
        oldMasterHost: oldMaster.node.host,
        oldMasterPort: oldMaster.node.port,
        newMasterName: this.currentMaster.name,
        newMasterHost: this.currentMaster.node.host,
        newMasterPort: this.currentMaster.node.port,
        occurredAt: new Date(),
      };

      this.logger.warn(
        "DB",
        `Failover completed. Old master: ${oldMaster.name}, new master: ${this.currentMaster.name}`,
      );
    } finally {
      this.failoverInProgress = false;
    }

    if (event) {
      await this.notifyFailoverListeners(event);
    }

    return this.currentMaster.node;
  }

  private async checkNode(info: NodeInfo): Promise<void> {
    const start = Date.now();
    let conn: PoolConnection | null = null;

    try {
      conn = await info.pool.getConnection();
      await conn.query("SELECT 1");

      const ms = Date.now() - start;

      info.node.status =
        ms > HEALTH_CHECK_TIMEOUT ? NodeStatus.DEGRADED : NodeStatus.HEALTHY;
    } catch (err) {
      info.node.status = NodeStatus.OFFLINE;
      info.node.failedReads++;

      this.logger.warn("DB", `Node ${info.name} failed health check`);
    } finally {
      if (conn) {
        conn.release();
      }

      info.node.lastCheck = new Date();
    }
  }

  private async tryGetSlaveReadConnection(
    candidates: NodeInfo[],
  ): Promise<DbConnectionResult | null> {
    if (candidates.length === 0) {
      return null;
    }

    for (let i = 0; i < candidates.length; i++) {
      const index = (this.slaveRrIndex + i) % candidates.length;
      const info = candidates[index];

      try {
        const conn = await info.pool.getConnection();

        this.slaveRrIndex = (index + 1) % candidates.length;
        info.node.successfulReads++;

        return {
          conn,
          nodeName: info.name,
        };
      } catch (err) {
        info.node.status = NodeStatus.OFFLINE;
        info.node.failedReads++;

        this.logger.warn("DB", `Slave ${info.name} unreachable, trying next`);
      }
    }

    return null;
  }

  private async getMasterReadConnection(): Promise<DbConnectionResult | null> {
    if (this.currentMaster.node.status === NodeStatus.OFFLINE) {
      this.currentMaster.node.failedReads++;

      this.logger.error("DB", DbLogMessages.masterAlsoOfflineReadNotPossible);

      return null;
    }

    try {
      const conn = await this.currentMaster.pool.getConnection();

      this.currentMaster.node.successfulReads++;

      return {
        conn,
        nodeName: this.currentMaster.name,
      };
    } catch (err) {
      this.currentMaster.node.status = NodeStatus.OFFLINE;
      this.currentMaster.node.failedReads++;

      this.logger.error(
        "DB",
        DbLogMessages.failedToConnectToMasterForRead,
        err instanceof Error ? err : null,
      );

      return null;
    }
  }

  private async handleAutomaticMasterFailover(): Promise<void> {
    if (this.failoverInProgress) {
      return;
    }

    if (this.currentMaster.node.status !== NodeStatus.OFFLINE) {
      return;
    }

    this.logger.warn(
      "DB",
      `Current master ${this.currentMaster.name} is offline. Starting automatic failover.`,
    );

    const promoted = await this.failoverToPreferredSlave("automatic");

    if (!promoted) {
      this.logger.error(
        "DB",
        DbLogMessages.automaticFailoverNoHealthySlave,
      );
    }
  }

  private async failoverToPreferredSlave(
    reason: DbFailoverReason,
  ): Promise<DbNode | null> {
    const slave1Index = this.slaves.findIndex(
      (slave) =>
        slave.name === "slave1" &&
        slave.node.status === NodeStatus.HEALTHY &&
        slave.canServeReads,
    );

    if (slave1Index !== -1) {
      return this.promoteSlaveToMaster(slave1Index, reason);
    }

    const healthySlaveIndex = this.slaves.findIndex(
      (slave) =>
        slave.node.status === NodeStatus.HEALTHY &&
        slave.canServeReads,
    );

    if (healthySlaveIndex === -1) {
      this.logger.error("DB", DbLogMessages.failoverNoHealthySlave);
      return null;
    }

    return this.promoteSlaveToMaster(healthySlaveIndex, reason);
  }

  private async notifyFailoverListeners(
    event: DbFailoverEvent,
  ): Promise<void> {
    await Promise.all(
      this.failoverListeners.map((listener) =>
        Promise.resolve(listener(event)),
      ),
    );
  }

  private async executeNodeCommand(info: NodeInfo,sql: string,): Promise<boolean> {
    let conn: PoolConnection | null = null;

    try {
      conn = await info.pool.getConnection();

      await conn.query(sql);

      return true;
    } catch (err) {
      this.logger.error(
        "DB",
        `Failed to execute command on ${info.name}`,
        err instanceof Error ? err : null,
      );

      return false;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  private async preparePromotedMaster(info: NodeInfo): Promise<boolean> {
    await this.executeOptionalNodeCommand(info, "STOP REPLICA");
    const resetReplica = await this.executeNodeCommand(info, "RESET REPLICA ALL");
    const disableReadOnly = await this.executeNodeCommand(
      info,
      "SET GLOBAL read_only = OFF",
    );

    const createReplicationUser = await this.executeNodeCommand(
      info,
      `CREATE USER IF NOT EXISTS '${REPLICATION_USER}'@'%'
      IDENTIFIED WITH mysql_native_password BY '${REPLICATION_PASSWORD}'`,
    );

    const grantReplication = await this.executeNodeCommand(
      info,
      `GRANT REPLICATION SLAVE ON *.* TO '${REPLICATION_USER}'@'%'`,
    );

    const flushPrivileges = await this.executeNodeCommand(
      info,
      "FLUSH PRIVILEGES",
    );

    return (
      resetReplica &&
      disableReadOnly &&
      createReplicationUser &&
      grantReplication &&
      flushPrivileges
    );
  }

  private async getMasterStatus(info: NodeInfo): Promise<MasterStatus | null> {
    let conn: PoolConnection | null = null;

    try {
      conn = await info.pool.getConnection();

      const [rows] = await conn.query<RowDataPacket[]>("SHOW MASTER STATUS");

      const row = rows[0];

      if (!row) {
        return null;
      }

      return {
        file: String(row.File),
        position: Number(row.Position),
      };
    } catch (err) {
      this.logger.error(
        "DB",
        `Failed to read master status from ${info.name}`,
        err instanceof Error ? err : null,
      );

      return null;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  private async executeOptionalNodeCommand(info: NodeInfo, sql: string): Promise<void> {
    const success = await this.executeNodeCommand(info, sql);

    if (!success) {
      this.logger.warn(
        "DB",
        `Optional command failed on ${info.name}: ${sql}`,
      );
    }
  }

  private async reconfigureReplica(
    replica: NodeInfo,
    source: NodeInfo,
    status: MasterStatus,
  ): Promise<boolean> {
    await this.executeOptionalNodeCommand(replica, "STOP REPLICA");
    await this.executeOptionalNodeCommand(replica, "RESET REPLICA ALL");

    const enableReadOnly = await this.executeNodeCommand(
      replica,
      "SET GLOBAL read_only = ON",
    );

    const changeSource = await this.executeNodeCommand(
      replica,
      `CHANGE REPLICATION SOURCE TO
        SOURCE_HOST='${source.node.replicaHost}',
        SOURCE_PORT=3306,
        SOURCE_USER='${REPLICATION_USER}',
        SOURCE_PASSWORD='${REPLICATION_PASSWORD}',
        SOURCE_LOG_FILE='${status.file}',
        SOURCE_LOG_POS=${status.position},
        GET_SOURCE_PUBLIC_KEY=1`,
    );

    const startReplica = await this.executeNodeCommand(replica, "START REPLICA");

    if (!startReplica) {
      this.logger.error(
        "DB",
        `Replica ${replica.name} could not start replication from ${source.name}`,
      );
    }

    return enableReadOnly && changeSource && startReplica;
  }

  private async handleRecoveredReplicaRejoin(): Promise<void> {
    if (this.failoverInProgress) {
      return;
    }

    if (!this.promotedMasterRecoveryStatus) {
      return;
    }

    const recoveredNodes = this.slaves.filter(
      (slave) =>
        !slave.canServeReads &&
        slave.node.status === NodeStatus.HEALTHY &&
        slave.name !== this.currentMaster.name,
    );

    for (const node of recoveredNodes) {
      this.logger.warn(
        "DB",
        `Recovered node ${node.name} detected. Rejoining as replica of ${this.currentMaster.name}.`,
      );

      this.failoverInProgress = true;

      try {
        const reconfigured = await this.reconfigureReplica(
          node,
          this.currentMaster,
          this.promotedMasterRecoveryStatus,
        );

        node.canServeReads = reconfigured;

        if (reconfigured) {
          this.logger.warn(
            "DB",
            `Recovered node ${node.name} rejoined as replica of ${this.currentMaster.name}`,
          );
        }
      } finally {
        this.failoverInProgress = false;
      }
    }
  }


}
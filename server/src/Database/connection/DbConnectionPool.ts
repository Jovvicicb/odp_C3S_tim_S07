import mysql, { Pool, PoolConnection } from "mysql2/promise";
import dotenv from "dotenv";

import { DbNode } from "../../Domain/models/DbNode";
import { NodeStatus } from "../../Domain/enums/nodes/NodeStatus";
import { DbNodeRole } from "../../Domain/enums/nodes/DbNodeRole";
import {
  HEALTH_CHECK_TIMEOUT,
  HEALTH_CHECK_INTERVAL_MS,
} from "../../Domain/constants/Constants";
import { ILoggerService } from "../../Domain/services/logger/ILoggerService";

dotenv.config();

export type DbNodeHealthSnapshot = {
  node: DbNode;
  role: DbNodeRole;
};

const DB_NAME = process.env.DB_NAME ?? "pulse_net_db";

const masterPool: Pool = mysql.createPool({
  host: process.env.DB_MASTER_HOST ?? "localhost",
  port: parseInt(process.env.DB_MASTER_PORT ?? "3306", 10),
  user: process.env.DB_MASTER_USER ?? "root",
  password: process.env.DB_MASTER_PASSWORD ?? "",
  database: process.env.DB_MASTER_NAME ?? DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: HEALTH_CHECK_TIMEOUT,
});

const slave1Pool: Pool = mysql.createPool({
  host: process.env.DB_SLAVE1_HOST ?? "localhost",
  port: parseInt(process.env.DB_SLAVE1_PORT ?? "3307", 10),
  user: process.env.DB_SLAVE1_USER ?? "root",
  password: process.env.DB_SLAVE1_PASSWORD ?? "",
  database: process.env.DB_SLAVE1_NAME ?? DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: HEALTH_CHECK_TIMEOUT,
});

const slave2Pool: Pool = mysql.createPool({
  host: process.env.DB_SLAVE2_HOST ?? "localhost",
  port: parseInt(process.env.DB_SLAVE2_PORT ?? "3308", 10),
  user: process.env.DB_SLAVE2_USER ?? "root",
  password: process.env.DB_SLAVE2_PASSWORD ?? "",
  database: process.env.DB_SLAVE2_NAME ?? DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: HEALTH_CHECK_TIMEOUT,
});

interface NodeInfo {
  name: string;
  pool: Pool;
  node: DbNode;
}

export class DbManager {
  private currentMaster: NodeInfo;
  private readonly slaves: NodeInfo[];
  private slaveRrIndex: number = 0;
  private healthTimer: NodeJS.Timeout | null = null;

  public constructor(private readonly logger: ILoggerService) {
    this.currentMaster = {
      name: "master",
      pool: masterPool,
      node: new DbNode(
        "master",
        process.env.DB_MASTER_HOST ?? "localhost",
        parseInt(process.env.DB_MASTER_PORT ?? "3306", 10),
      ),
    };

    this.slaves = [
      {
        name: "slave1",
        pool: slave1Pool,
        node: new DbNode(
          "slave1",
          process.env.DB_SLAVE1_HOST ?? "localhost",
          parseInt(process.env.DB_SLAVE1_PORT ?? "3307", 10),
        ),
      },
      {
        name: "slave2",
        pool: slave2Pool,
        node: new DbNode(
          "slave2",
          process.env.DB_SLAVE2_HOST ?? "localhost",
          parseInt(process.env.DB_SLAVE2_PORT ?? "3308", 10),
        ),
      },
    ];
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
  }

  public async init(): Promise<void> {
    await this.runHealthCheck();

    this.healthTimer = setInterval(
      () => void this.runHealthCheck(),
      HEALTH_CHECK_INTERVAL_MS,
    );
  }

  public async getWriteConnection(): Promise<{
    conn: PoolConnection;
    nodeName: string;
  } | null> {
    if (this.currentMaster.node.status === NodeStatus.OFFLINE) {
      this.currentMaster.node.failedWrites++;

      this.logger.error("DB", "Master is OFFLINE — write not possible");

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
        "Failed to connect to master",
        err instanceof Error ? err : null,
      );

      return null;
    }
  }

  public async getReadConnection(): Promise<{
    conn: PoolConnection;
    nodeName: string;
  } | null> {
    const slavesCount = this.slaves.length;

    for (let i = 0; i < slavesCount; i++) {
      const index = (this.slaveRrIndex + i) % slavesCount;
      const info = this.slaves[index];

      if (info.node.status === NodeStatus.OFFLINE) {
        continue;
      }

      try {
        const conn = await info.pool.getConnection();

        this.slaveRrIndex = (index + 1) % slavesCount;
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

    this.logger.warn("DB", "All slaves offline — falling back to master for read");

    if (this.currentMaster.node.status === NodeStatus.OFFLINE) {
      this.currentMaster.node.failedReads++;

      this.logger.error("DB", "Master also offline — read not possible");

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
        "Failed to connect to master for fallback read",
        err instanceof Error ? err : null,
      );

      return null;
    }
  }

  public async triggerFailover(): Promise<DbNode | null> {
    const healthySlave = this.slaves.find(
      (slave) => slave.node.status === NodeStatus.HEALTHY,
    );

    if (!healthySlave) {
      this.logger.error("DB", "Failover failed - no healthy slave available");
      return null;
    }

    const oldMaster = this.currentMaster;

    this.currentMaster = healthySlave;

    const updatedSlaves = this.slaves.filter(
      (slave) => slave.name !== healthySlave.name,
    );

    updatedSlaves.push(oldMaster);

    this.slaves.length = 0;
    this.slaves.push(...updatedSlaves);

    this.logger.warn(
      "DB",
      `Failover completed. New master: ${this.currentMaster.name}`,
    );

    return this.currentMaster.node;
  }

  public getNodeHealthSnapshots(): DbNodeHealthSnapshot[] {
    return [
      {
        node: this.currentMaster.node,
        role: DbNodeRole.MASTER,
      },
      ...this.slaves.map((slave) => ({
        node: slave.node,
        role: DbNodeRole.SLAVE,
      })),
    ];
  }

  public getSlaveRrIndex(): number {
    return this.slaveRrIndex;
  }

  public stop(): void {
    if (this.healthTimer) {
      clearInterval(this.healthTimer);
    }
  }
}
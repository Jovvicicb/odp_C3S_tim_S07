-- Executed automatically when the Master container first starts.
--
-- IMPORTANT: setup-replication.sh later applies the schema (tables).
-- Here we only create the replication user because it must exist
-- BEFORE the slave nodes attempt to connect.

-- User that Slave nodes use to read the binary log.
-- mysql_native_password — compatible with older mysql2 clients.
CREATE USER IF NOT EXISTS 'replicator'@'%'
  IDENTIFIED WITH mysql_native_password BY 'repl1234';

GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'%';

FLUSH PRIVILEGES;

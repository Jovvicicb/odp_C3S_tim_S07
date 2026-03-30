FROM mysql:8.0
COPY my.cnf /etc/mysql/conf.d/replication.cnf
RUN chmod 644 /etc/mysql/conf.d/replication.cnf
COPY init.sql /docker-entrypoint-initdb.d/init.sql
RUN chmod 644 /docker-entrypoint-initdb.d/init.sql

# PulseNet

PulseNet is a full-stack TypeScript social platform built with React, Node.js, Express and MySQL replication. The application supports authentication, role-based access control, communities, posts, comments, likes, tags, user following, audit logs, admin dashboard, database health monitoring and failover handling.

## Tech Stack

| Layer    | Technology                                             |
| -------- | ------------------------------------------------------ |
| Frontend | React 19, Vite, TailwindCSS v4, React Router v7, Axios |
| Backend  | Node.js, Express 5, TypeScript                         |
| Auth     | JWT, bcryptjs, role-based access control               |
| Database | MySQL 8, mysql2, Master-Slave replication              |
| DevOps   | Docker, Docker Compose                                 |

## Main Features

- JWT authentication and protected routes
- User roles: regular user and admin
- User profile management with image upload
- User follow / unfollow system
- Public and private communities
- Community membership, join requests and moderation
- Markdown posts with optional image upload
- Post likes and tag management
- Nested comments and comment likes
- Admin dashboard with statistics
- Audit log tracking for important system actions
- MySQL Master + 2 Slave replication
- Read distribution across healthy Slave nodes
- Fallback reads to Master when Slaves are unavailable
- Automatic and manual database failover
- Database health status exposed through API

## Project Structure

```txt
odp_C3S_tim_S07/
├── client/                    # React frontend
│   ├── public/                # Static assets
│   └── src/
│       ├── api_services/      # Axios API service classes and interfaces
│       ├── components/        # Reusable UI and feature components
│       │   ├── admin/         # Admin dashboard sections
│       │   ├── auth/          # Login and register components
│       │   ├── comments/      # Comment cards, forms and actions
│       │   ├── communities/   # Community cards, details, forms and membership UI
│       │   ├── posts/         # Post cards, details, forms and tags
│       │   ├── users/         # User profile, search and follow UI
│       │   └── ui/            # Shared UI components
│       ├── constants/         # Client-side messages and constants
│       ├── contexts/          # Auth and toast contexts
│       ├── helpers/           # Utility helpers
│       ├── hooks/             # Custom React hooks
│       ├── models/            # Client-side DTO models
│       ├── pages/             # Route pages
│       ├── types/             # TypeScript types
│       └── validators/        # Client-side form validators
│
├── server/                    # Express backend
│   └── src/
│       ├── Database/
│       │   ├── connection/    # DbManager: pools, health checks and failover
│       │   └── repositories/  # Concrete repository implementations
│       ├── Domain/            # Domain layer
│       │   ├── DTOs/          # Data Transfer Objects
│       │   ├── constants/     # Messages, app constants and HTTP status codes
│       │   ├── enums/         # TypeScript enums
│       │   ├── models/        # Domain models
│       │   ├── repositories/  # Repository interfaces
│       │   ├── services/      # Service interfaces
│       │   └── types/         # Shared domain types
│       ├── Middlewares/       # Authentication, authorization and upload middleware
│       ├── Services/          # Business logic services
│       ├── Shared/            # Helpers, mappers and normalization utilities
│       └── WebAPI/
│           ├── controllers/   # Express route controllers
│           ├── parser/        # Query and route parameter parsers
│           ├── types/         # Request input types
│           └── validators/    # Server-side validation functions
│
├── docker/                    # MySQL replication setup
│   ├── master/                # Master node Dockerfile, config and init script
│   ├── slave1/                # Slave 1 Dockerfile and config
│   ├── slave2/                # Slave 2 Dockerfile and config
│   └── setup-replication.sh   # Replication bootstrap script
│
├── docker-compose.yml         # Docker services for the replicated MySQL setup
├── DB_Upiti.sql               # SQL queries and scripts used for database testing/documentation
├── PulseNet_ERD.pdf           # Entity-Relationship diagram of the PulseNet database
└── README.md                  # Project documentation and setup instructions
```

## Environment Variables

Sensitive values are not committed to the repository. Local configuration should be placed in `.env` files, while `.env.example` files are used as documentation for required variables.

The frontend uses only variables prefixed with `VITE_`.

Required environment files:

```txt
server/.env
client/.env
```

Example files:

```txt
server/.env.example
client/.env.example
```

## Getting Started

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Set up replication

```bash
docker cp docker/setup-replication.sh project_master:/setup.sh
docker exec project_master sh /setup.sh
```

### 3. Start the server

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Fill in the required `.env` values before running the server.

### 4. Start the client

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Fill in the required `.env` values before running the client.

## Database Replication and Failover

PulseNet uses one MySQL Master node and two MySQL Slave nodes.

### Write operations

All write operations are routed only to the current Master node:

- `INSERT`
- `UPDATE`
- `DELETE`

If failover is in progress or the Master is unavailable, write operations are blocked and the API returns an appropriate service unavailable response.

### Read operations

Read operations are distributed between available Slave nodes using round-robin selection.

Read routing order:

1. Healthy Slave nodes
2. Degraded Slave nodes, only if no healthy Slave exists
3. Master node, only if no Slave is available

### Health check

The server periodically checks all database nodes by running:

```sql
SELECT 1;
```

Each node can have one of the following states:

| Status   | Meaning                                                 |
| -------- | ------------------------------------------------------- |
| Healthy  | Node responds within the expected time                  |
| Degraded | Node responds, but slower than the configured threshold |
| Offline  | Node is unreachable or throws an error                  |

### Failover

If the current Master becomes unavailable, the server tries to promote a healthy Slave node to the new Master.

During failover:

- read and write operations are temporarily blocked
- the selected Slave is promoted to Master
- other nodes are reconfigured as replicas of the new Master
- the failover event is written to the audit log

Manual failover is also available through the health/admin functionality.

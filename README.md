# Project Template

Full-stack TypeScript template with:
- **Client**: React 19 + Vite + TailwindCSS v4 + React Router v7
- **Server**: Node.js + Express 5 + TypeScript
- **Database**: MySQL 8 with Master + 2 Slave replication via Docker
- **Auth**: JWT-based authentication with role-based access control

## Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React, Vite, TailwindCSS, Axios         |
| Backend    | Node.js, Express, TypeScript            |
| Auth       | JWT (jsonwebtoken), bcryptjs            |
| Database   | MySQL 8, mysql2, Master-Slave replication |
| DevOps     | Docker, docker-compose                  |

## Project Structure

```
project/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── api_services/    # Axios API service classes (Interface + Implementation)
│       ├── components/      # Reusable UI components
│       ├── contexts/        # React contexts (AuthContext)
│       ├── helpers/         # Utility functions (localStorage wrapper)
│       ├── hooks/           # Custom React hooks
│       ├── models/          # Client-side DTOs / types
│       ├── pages/           # Page components (admin/, user/, auth/, not_found/)
│       └── types/           # TypeScript type definitions
│
├── server/                  # Express backend
│   └── src/
│       ├── Database/
│       │   ├── connection/  # DbManager — Master/Slave pool with health checks
│       │   └── repositories/ # Concrete repository implementations
│       ├── Domain/          # Domain layer (no framework dependencies)
│       │   ├── DTOs/        # Data Transfer Objects
│       │   ├── constants/   # App-wide constants
│       │   ├── enums/       # TypeScript enums
│       │   ├── models/      # Domain entity classes
│       │   ├── repositories/ # Repository interfaces (IXxxRepository)
│       │   ├── services/    # Service interfaces (IXxxService)
│       │   └── types/       # Shared types (JwtPayload, ValidationResult)
│       ├── Middlewares/     # Express middlewares (auth, authorization)
│       ├── Services/        # Service implementations
│       └── WebAPI/
│           ├── controllers/ # Express route controllers
│           └── validators/  # Input validation functions
│
└── docker/                  # MySQL replication setup
    ├── master/              # Master node config + init.sql
    ├── slave1/              # Slave 1 config
    ├── slave2/              # Slave 2 config
    └── setup-replication.sh # Replication bootstrap script
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
cp .env.example .env   # fill in your values
npm install
npm run dev
```

### 4. Start the client

```bash
cd client
npm install
npm run dev
```

## Customisation Checklist

- [ ] Rename `project_db` → your database name (docker-compose.yml, setup-replication.sh, .env.example)
- [ ] Replace `Entity` / `entities` with your domain model name throughout
- [ ] Update `UserRole` enum if you need different roles
- [ ] Update nav items in `Layout.tsx` to match your routes
- [ ] Add your domain-specific routes in `App.tsx`
- [ ] Update table schema in `setup-replication.sh`
- [ ] Replace `AppName` in `Layout.tsx` with your app name

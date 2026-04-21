import "dotenv/config";
import express from "express";
import cors from "cors";

import { ConsoleLoggerService } from "./Services/logger/ConsoleLoggerService";
import { DbManager } from "./Database/connection/DbConnectionPool";

import { UserRepository }   from "./Database/repositories/users/UserRepository";
import { CommunityRepository } from "./Database/repositories/community/CommunityRepository";


import { AuthService }   from "./Services/auth/AuthService";
import { UserService }   from "./Services/users/UserService";
import { CommunityService } from "./Services/community/CommunityService";

import { AuthController }   from "./WebAPI/controllers/AuthController";
import { UserController }   from "./WebAPI/controllers/UserController";
import { CommunityController } from "./WebAPI/controllers/CommunityController";

import { errorHandler } from "./Middlewares/multer/errorHandler";
import { AuditRepository } from "./Database/repositories/audits/AuditRepository";
import { AuditService } from "./Services/audits/AuditService";
import { AuditController } from "./WebAPI/controllers/AuditController";
import { AuditHelperService } from "./Services/common/AuditHelperService";


export const logger = new ConsoleLoggerService();
export const db     = new DbManager(logger);



// Repositories
const userRepo   = new UserRepository(db, logger);
const communityRepo = new CommunityRepository(db, logger);
const auditRepo = new AuditRepository(db,logger);

// Services
const auditService =new AuditService(auditRepo);
const auditHelperService = new AuditHelperService(auditService,logger);
const authService   = new AuthService(userRepo,auditHelperService);
const userService   = new UserService(userRepo,auditHelperService);
const communityService = new CommunityService(communityRepo,auditHelperService);


// Express
const app = express();

app.set("trust proxy", true);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", express.static("uploads"));


app.use(cors({ origin: process.env.CLIENT_URL ?? "*" }));

app.use("/api/v1", new AuthController(authService,logger).getRouter());
app.use("/api/v1", new UserController(userService,logger).getRouter());
app.use("/api/v1", new CommunityController(communityService,userService,logger).getRouter());
app.use("/api/v1", new AuditController(auditService,logger).getRouter());

app.use(errorHandler);

export default app;

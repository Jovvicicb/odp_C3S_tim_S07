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


export const logger = new ConsoleLoggerService();
export const db     = new DbManager(logger);



// Repositories
const userRepo   = new UserRepository(db, logger);
const communityRepo = new CommunityRepository(db, logger);

// Services
const authService   = new AuthService(userRepo);
const userService   = new UserService(userRepo);
const communityService = new CommunityService(communityRepo);

// Express
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", express.static("uploads"));


app.use(cors({ origin: process.env.CLIENT_URL ?? "*" }));

app.use("/api/v1", new AuthController(authService).getRouter());
app.use("/api/v1", new UserController(userService).getRouter());
app.use("/api/v1", new CommunityController(communityService,userService).getRouter());

app.use(errorHandler);

export default app;

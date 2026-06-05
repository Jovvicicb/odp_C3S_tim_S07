import "dotenv/config";

import cors from "cors";
import express from "express";

import { DbManager } from "./Database/connection/DbConnectionPool";

import { AuditRepository } from "./Database/repositories/audits/AuditRepository";
import { CommentLikeRepository } from "./Database/repositories/comments/CommentLikeRepository";
import { CommentRepository } from "./Database/repositories/comments/CommentRepository";
import { CommunityMemberRepository } from "./Database/repositories/community/CommunityMemberRepository";
import { CommunityRepository } from "./Database/repositories/community/CommunityRepository";
import { PostCommentRepository } from "./Database/repositories/posts/PostCommentRepository";
import { PostLikeRepository } from "./Database/repositories/posts/PostLikeRepository";
import { PostRepository } from "./Database/repositories/posts/PostRepository";
import { PostTagRepository } from "./Database/repositories/posts/PostTagRepository";
import { StatisticsRepository } from "./Database/repositories/statistics/StatisticsRepository";
import { TagRepository } from "./Database/repositories/tags/TagRepository";
import { UserFollowRepository } from "./Database/repositories/users/UserFollowRepository";
import { UserRepository } from "./Database/repositories/users/UserRepository";

import { AuditActions } from "./Domain/constants/messages/audits/AuditActions";
import { AuditDetails } from "./Domain/constants/messages/audits/AuditDetails";
import { CreateAuditDto } from "./Domain/DTOs/audits/CreateAuditDto";

import { errorHandler } from "./Middlewares/multer/errorHandler";

import { AuditController } from "./WebAPI/controllers/AuditController";
import { AuthController } from "./WebAPI/controllers/AuthController";
import { CommentController } from "./WebAPI/controllers/CommentController";
import { CommunityController } from "./WebAPI/controllers/CommunityController";
import { HealthController } from "./WebAPI/controllers/HealthController";
import { PostController } from "./WebAPI/controllers/PostController";
import { StatisticsController } from "./WebAPI/controllers/StatisticsController";
import { TagController } from "./WebAPI/controllers/TagController";
import { UserController } from "./WebAPI/controllers/UserController";

import { AuthService } from "./Services/auth/AuthService";
import { AuditHelperService } from "./Services/common/AuditHelperService";
import { AuditService } from "./Services/audits/AuditService";
import { CommentLikeService } from "./Services/comments/CommentLikeService";
import { CommentService } from "./Services/comments/CommentService";
import { CommunityMemberService } from "./Services/community/CommunityMemberService";
import { CommunityService } from "./Services/community/CommunityService";
import { HealthService } from "./Services/health/HealthService";
import { ConsoleLoggerService } from "./Services/logger/ConsoleLoggerService";
import { PostLikeService } from "./Services/posts/PostLikeService";
import { PostService } from "./Services/posts/PostService";
import { PostTagService } from "./Services/posts/PostTagService";
import { StatisticsService } from "./Services/statistics/StatisticsService";
import { TagService } from "./Services/tags/TagService";
import { UserFollowService } from "./Services/users/UserFollowService";
import { UserService } from "./Services/users/UserService";

export const logger = new ConsoleLoggerService();
export const db     = new DbManager(logger);

// Repositories
const userRepo = new UserRepository(db, logger);
const communityRepo = new CommunityRepository(db, logger);
const auditRepo = new AuditRepository(db,logger);
const userFollowRepo = new UserFollowRepository(db,logger);
const communityMemberRepo = new CommunityMemberRepository(db,logger);
const tagRepo = new TagRepository(db,logger);
const postRepo = new PostRepository(db,logger);
const postTagRepo = new PostTagRepository(db,logger);
const postLikeRepo = new PostLikeRepository(db,logger);
const postCommentRepo = new PostCommentRepository(db,logger);
const commentRepo = new CommentRepository(db,logger);
const commentLikeRepo = new CommentLikeRepository(db,logger);
const statisticsRepo = new StatisticsRepository(db, logger);

// Services
const auditService =new AuditService(auditRepo);
const auditHelperService = new AuditHelperService(auditService,logger);
const authService = new AuthService(userRepo,auditHelperService,db);

db.registerFailoverListener(async (event) => {
  await auditHelperService.safeCreate(
    new CreateAuditDto(
      null,
      AuditActions.DB_FAILOVER,
      `${AuditDetails.DB_FAILOVER} (${event.reason}): ${event.oldMasterName}:${event.oldMasterPort} -> ${event.newMasterName}:${event.newMasterPort}`,
      "system",
    ),
  );
});

const userService = new UserService(userRepo,userFollowRepo,auditHelperService,db);
const communityService = new CommunityService(communityRepo,communityMemberRepo,userRepo,userFollowRepo,auditHelperService,db);
const userFollowService = new UserFollowService(userFollowRepo,userRepo,db);
const communityMemberService = new CommunityMemberService(communityMemberRepo,communityRepo,userRepo,userFollowRepo,auditHelperService,db);
const tagService = new TagService(tagRepo,auditHelperService,db);
const commentService = new CommentService(commentRepo,postRepo,communityRepo,communityMemberRepo,commentLikeRepo,userRepo,auditHelperService,db);
const postService = new PostService(postRepo,communityRepo,communityMemberRepo,postTagRepo,postLikeRepo,tagRepo,postCommentRepo,userFollowRepo,userRepo,commentService,auditHelperService,db);
const postTagService = new PostTagService(postRepo,communityMemberRepo,tagRepo,postTagRepo,auditHelperService,db);
const postLikeService = new PostLikeService(postRepo,postLikeRepo,communityRepo,communityMemberRepo,db);
const commentLikeService = new CommentLikeService(commentRepo,commentLikeRepo,postRepo,communityRepo,communityMemberRepo,db);
const healthService = new HealthService(db); 
const statisticsService = new StatisticsService(statisticsRepo);

// Express
const app = express();

app.set("trust proxy", true);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", express.static("uploads"));


app.use(cors({ origin: process.env.CLIENT_URL ?? "*" }));

app.use("/api/v1", new HealthController(healthService,logger).getRouter());
app.use("/api/v1", new AuthController(authService,logger).getRouter());
app.use("/api/v1", new UserController(userService,userFollowService,logger).getRouter());
app.use("/api/v1", new CommunityController(communityService,communityMemberService,logger).getRouter());
app.use("/api/v1", new AuditController(auditService,logger).getRouter());
app.use("/api/v1", new TagController(tagService,logger).getRouter());
app.use("/api/v1", new PostController(postService,postTagService,postLikeService,logger).getRouter());
app.use("/api/v1", new CommentController(commentService,commentLikeService,logger).getRouter());
app.use("/api/v1", new StatisticsController(statisticsService, logger).getRouter());

app.use(errorHandler);

export default app;

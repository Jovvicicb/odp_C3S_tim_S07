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
import { UserFollowService } from "./Services/users/UserFollowService";
import { UserFollowRepository } from "./Database/repositories/users/UserFollowRepository";
import { CommunityMemberRepository } from "./Database/repositories/community/CommunityMemberRepository";
import { CommunityMemberService } from "./Services/community/CommunityMemberService";
import { TagRepository } from "./Database/repositories/tags/TagRepository";
import { TagService } from "./Services/tags/TagService";
import { TagController } from "./WebAPI/controllers/TagController";
import { PostService } from "./Services/posts/PostService";
import { PostRepository } from "./Database/repositories/posts/PostRepository";
import { PostController } from "./WebAPI/controllers/PostConntroler";
import { PostTagRepository } from "./Database/repositories/posts/PostTagRepository";
import { PostTagService } from "./Services/posts/PostTagService";
import { PostLikeRepository } from "./Database/repositories/posts/PostLikeRepository";
import { PostLikeService } from "./Services/posts/PostLikeService";
import { PostCommentRepository } from "./Database/repositories/posts/PostCommentRepository";
import { CommentRepository } from "./Database/repositories/comments/CommentRepository";
import { CommentService } from "./Services/comments/CommentService";
import { CommentController } from "./WebAPI/controllers/CommentControler";
import { CommentLikeRepository } from "./Database/repositories/comments/CommentLikeRepository";
import { CommentLikeService } from "./Services/comments/CommentLikeService";


export const logger = new ConsoleLoggerService();
export const db     = new DbManager(logger);

// Repositories
const userRepo   = new UserRepository(db, logger);
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



// Services
const auditService =new AuditService(auditRepo);
const auditHelperService = new AuditHelperService(auditService,logger);
const authService   = new AuthService(userRepo,auditHelperService);
const userService   = new UserService(userRepo,auditHelperService);
const communityService = new CommunityService(communityRepo,communityMemberRepo,userRepo,auditHelperService);
const userFollowService   = new UserFollowService(userFollowRepo,userRepo,userService);
const communityMemberService = new CommunityMemberService(communityMemberRepo,communityRepo,auditHelperService);
const tagService = new TagService(tagRepo,auditHelperService);
const postService = new PostService(postRepo,communityRepo,communityMemberRepo,postTagRepo,postLikeRepo,tagRepo,postCommentRepo,userFollowRepo,auditHelperService);
const postTagService = new PostTagService(postRepo,communityMemberRepo,tagRepo,postTagRepo,auditHelperService);
const postLikeService = new PostLikeService(postRepo,postLikeRepo,communityRepo,communityMemberRepo);
const commentService = new CommentService(commentRepo,postRepo,communityRepo,communityMemberRepo,commentLikeRepo,auditHelperService);
const commentLikeService = new CommentLikeService(commentRepo,commentLikeRepo,postRepo,communityRepo,communityMemberRepo);



// Express
const app = express();

app.set("trust proxy", true);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", express.static("uploads"));


app.use(cors({ origin: process.env.CLIENT_URL ?? "*" }));

app.use("/api/v1", new AuthController(authService,logger).getRouter());
app.use("/api/v1", new UserController(userService,userFollowService,logger).getRouter());
app.use("/api/v1", new CommunityController(communityService,communityMemberService,logger).getRouter());
app.use("/api/v1", new AuditController(auditService,logger).getRouter());
app.use("/api/v1", new TagController(tagService,logger).getRouter());
app.use("/api/v1", new PostController(postService,postTagService,postLikeService,logger).getRouter());
app.use("/api/v1", new CommentController(commentService,commentLikeService,logger).getRouter());




app.use(errorHandler);

export default app;

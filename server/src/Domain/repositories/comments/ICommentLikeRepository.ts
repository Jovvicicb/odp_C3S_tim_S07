import { CommentLike } from "../../models/CommentLike";

export interface ICommentLikeRepository {
  create(userId: number, commentId: number): Promise<CommentLike>;
  exists(userId: number, commentId: number): Promise<boolean>;
}
import { CommentLike } from "../../models/CommentLike";

export interface ICommentLikeRepository {
  create(userId: number, commentId: number): Promise<CommentLike>;
  delete(userId: number, commentId: number): Promise<boolean>;
  exists(userId: number, commentId: number): Promise<boolean>;
}
import { PostLike } from "../../models/PostLike";

export interface IPostLikeRepository {
   create(userId: number, postId: number): Promise<PostLike>;
   exists(userId: number, postId: number): Promise<boolean>;
}
 
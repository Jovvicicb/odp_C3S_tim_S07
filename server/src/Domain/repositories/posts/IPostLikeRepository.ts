import { PostLike } from "../../models/PostLike";

export interface IPostLikeRepository {
   countByPostIds(postIds: number[]): Promise<Record<number, number>>;
   create(userId: number, postId: number): Promise<PostLike>;
   delete(userId: number, postId: number): Promise<boolean>;
   exists(userId: number, postId: number): Promise<boolean>;
}
 
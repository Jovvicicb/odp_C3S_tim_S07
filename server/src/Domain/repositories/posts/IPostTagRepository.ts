import { PostTag } from "../../models/PostTag";

export interface IPostTagRepository {
   findTagIdsByPostIds(postIds: number[]): Promise<Record<number, number[]>>;
   create(postId: number, tagId: number): Promise<PostTag>;
   delete(postId: number, tagId: number): Promise<boolean>;
   exists(postId: number, tagId: number): Promise<boolean>;
  }
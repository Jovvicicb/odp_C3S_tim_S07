import { PostTag } from "../../models/PostTag";

export interface IPostTagRepository {
   create(postId: number, tagId: number): Promise<PostTag>;
   delete(postId: number, tagId: number): Promise<boolean>;
   exists(postId: number, tagId: number): Promise<boolean>;
  }
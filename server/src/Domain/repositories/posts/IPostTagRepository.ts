import { PostTag } from "../../models/PostTag";

export interface IPostTagRepository {
   create(postId: number, tagId: number): Promise<PostTag>;
   exists(postId: number, tagId: number): Promise<boolean>;
  }
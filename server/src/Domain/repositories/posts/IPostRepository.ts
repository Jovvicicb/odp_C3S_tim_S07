import { CreatePostDto } from "../../DTOs/Posts/CreatePostDto";
import { Post } from "../../models/Post";

export interface IPostRepository {
    create(dto: CreatePostDto): Promise<Post>;
}
 
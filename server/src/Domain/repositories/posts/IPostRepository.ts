import { CreatePostDto } from "../../DTOs/Posts/CreatePostDto";
import { Post } from "../../models/Post";

export interface IPostRepository {
    findById(id: number): Promise<Post>;
    create(dto: CreatePostDto): Promise<Post>;
    delete(id: number): Promise<boolean>;
}
 
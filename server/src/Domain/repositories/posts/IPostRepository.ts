import { CreatePostDto } from "../../DTOs/Posts/CreatePostDto";
import { UpdatePostDto } from "../../DTOs/Posts/UpdatePostDto";
import { Post } from "../../models/Post";

export interface IPostRepository {
    findById(id: number): Promise<Post>;
    create(dto: CreatePostDto): Promise<Post>;
    update(userId: number, dto: UpdatePostDto): Promise<boolean>;
    delete(id: number): Promise<boolean>;
}
 
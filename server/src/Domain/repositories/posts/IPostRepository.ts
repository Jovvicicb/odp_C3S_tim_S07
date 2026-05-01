import { CreatePostDto } from "../../DTOs/Posts/CreatePostDto";
import { GetPostsByCommunityDto } from "../../DTOs/Posts/GetPostsByCommunityDto";
import { UpdatePostDto } from "../../DTOs/Posts/UpdatePostDto";
import { Post } from "../../models/Post";

export interface IPostRepository {
    findById(id: number): Promise<Post>;
    findByCommunity(dto: GetPostsByCommunityDto): Promise<{posts: Post[]; total: number;}>;
    findFeed(page: number, limit: number, activeCommunityIds: number[], followingUserIds: number[], publicCommunityIds: number[]): Promise<{ posts: Post[]; total: number }>;
    create(dto: CreatePostDto): Promise<Post>;
    update(postId: number, dto: UpdatePostDto): Promise<boolean>;
    delete(id: number): Promise<boolean>;
}
 
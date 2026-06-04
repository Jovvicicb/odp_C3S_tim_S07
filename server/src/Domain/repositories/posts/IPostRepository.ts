import { CreatePostDto } from "../../DTOs/posts/CreatePostDto";
import { GetAdminPostsDto } from "../../DTOs/posts/GetAdminPostsDto";
import { GetPostsByCommunityDto } from "../../DTOs/posts/GetPostsByCommunityDto";
import { GetPostsByUserDto } from "../../DTOs/posts/GetPostsByUserDto";
import { UpdatePostDto } from "../../DTOs/posts/UpdatePostDto";
import { Post } from "../../models/Post";

export interface IPostRepository {
    findAll(dto: GetAdminPostsDto): Promise<{ posts: Post[]; total: number }>;
    findById(id: number): Promise<Post>;
    findByIds(ids: number[]): Promise<Post[]>;
    findByCommunity(dto: GetPostsByCommunityDto): Promise<{posts: Post[]; total: number;}>;
    findFeed(page: number, limit: number, activeCommunityIds: number[], followingUserIds: number[], publicCommunityIds: number[]): Promise<{ posts: Post[]; total: number }>;
    findCommunityIdsByAuthorId(authorId: number): Promise<number[]>;
    findAllByAuthorId(dto: GetPostsByUserDto,): Promise<Post[]>;
    findAllByAuthorIdAndCommunityIds(dto: GetPostsByUserDto, communityIds: number[],): Promise<Post[]>;   
    create(dto: CreatePostDto): Promise<Post>;
    update(postId: number, dto: UpdatePostDto): Promise<boolean>;
    delete(id: number): Promise<boolean>;

}
 
import { GetFollowersDto } from "../../DTOs/users/GetFollowersDto";
import { UserFollow } from "../../models/UserFollow";

export interface IUserFollowRepository {
    create(followerId: number,followingId: number):Promise<UserFollow>;
    delete(followerId: number,followingId: number):Promise<boolean>;
    getFollowers(dto: GetFollowersDto):Promise<{followerIds: number[]; total: number}>;
    exists(followerId: number,followingId: number):Promise<boolean>;
}
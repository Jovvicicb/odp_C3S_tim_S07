import { GetFollowersDto } from "../../DTOs/users/GetFollowersDto";
import { GetFollowingDto } from "../../DTOs/users/GetFollowingDto";
import { UserFollow } from "../../models/UserFollow";

export interface IUserFollowRepository {
    create(followerId: number,followingId: number):Promise<UserFollow>;
    delete(followerId: number,followingId: number):Promise<boolean>;
    getFollowers(dto: GetFollowersDto):Promise<{followerIds: number[]; total: number}>;
    getFollowing(dto: GetFollowingDto):Promise<{followingIds: number[]; total: number}>;
    findFollowingIdsByUserId(userId: number): Promise<number[]>;
    exists(followerId: number,followingId: number):Promise<boolean>;
}
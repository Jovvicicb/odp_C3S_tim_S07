import { UserFollow } from "../../models/UserFollow";

export interface IUserFollowRepository {
    create(followerId: number,followingId: number):Promise<UserFollow>;
    exists(followerId: number,followingId: number):Promise<boolean>;
}
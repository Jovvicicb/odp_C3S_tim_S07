import { UserFollow } from "../../models/UserFollow";

export interface IUserFollowRepository {
    create(followerId: number,followingId: number):Promise<UserFollow>;
    delete(followerId: number,followingId: number):Promise<boolean>;
    exists(followerId: number,followingId: number):Promise<boolean>;
}
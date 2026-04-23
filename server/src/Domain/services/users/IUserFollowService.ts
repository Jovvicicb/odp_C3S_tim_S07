import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";
import { GetFollowersDto } from "../../DTOs/users/GetFollowersDto";
import { GetFollowingDto } from "../../DTOs/users/GetFollowingDto";
import { UserDto } from "../../DTOs/users/UserDto";
import { ServiceResult } from "../../types/service/ServiceResult";

export interface IUserFollowService {
    follow(targetUserId: number,userId: number): Promise<ServiceResult>;
    unfollow(targetUserId: number,userId: number): Promise<ServiceResult>;
    getFollowers(dto: GetFollowersDto): Promise<ServiceResult<PaginatedListDto<UserDto>>>;
    getFollowing(dto: GetFollowingDto): Promise<ServiceResult<PaginatedListDto<UserDto>>>;
}
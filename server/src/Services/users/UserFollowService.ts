import { UserMessages } from "../../Domain/constants/messages/user/UserMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { PaginatedListDto } from "../../Domain/DTOs/common/PaginatedListDto";
import { GetFollowersDto } from "../../Domain/DTOs/users/GetFollowersDto";
import { GetFollowingDto } from "../../Domain/DTOs/users/GetFollowingDto";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { IUserFollowRepository } from "../../Domain/repositories/users/IUserFollowRepository";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { IUserFollowService } from "../../Domain/services/users/IUserFollowService";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { UserMapper } from "../../Shared/mappers/users/UserMapper";

export class UserFollowService implements IUserFollowService{
    public constructor(
        private readonly userFollowRepo:IUserFollowRepository,
        private readonly userRepo: IUserRepository
    ){}


    async follow(targetUserId: number, userId: number): Promise<ServiceResult> {
        if(userId === targetUserId){
            return ServiceResultFactory.fail(UserMessages.cannotFollowYourself, HttpStatus.badRequest);
        }

        const targetExists = await this.userRepo.exists(targetUserId);
        if(!targetExists){
            return ServiceResultFactory.fail(UserMessages.notFound, HttpStatus.notFound);
        }

        const alreadyExists = await this.userFollowRepo.exists(userId,targetUserId);
        if(alreadyExists){
            return ServiceResultFactory.fail(UserMessages.alreadyFollowing, HttpStatus.conflict);
        }

        const created = await this.userFollowRepo.create(userId,targetUserId);
        if(created.id === 0){
            return ServiceResultFactory.fail(UserMessages.followFailed, HttpStatus.internalServerError);
        }

        return ServiceResultFactory.ok(UserMessages.followed, undefined, HttpStatus.ok);
    }

    async unfollow(targetUserId: number, userId: number): Promise<ServiceResult> {
        if(userId === targetUserId){
            return ServiceResultFactory.fail(UserMessages.cannotUnfollowYourself, HttpStatus.badRequest);
        }

        const targetExists = await this.userRepo.exists(targetUserId);
        if(!targetExists){
            return ServiceResultFactory.fail(UserMessages.notFound, HttpStatus.notFound);
        }

        const exists = await this.userFollowRepo.exists(userId,targetUserId);
        if(!exists){
            return ServiceResultFactory.fail(UserMessages.notFollowing, HttpStatus.notFound);
        }

        const deleted = await this.userFollowRepo.delete(userId,targetUserId);
        if(!deleted){
            return ServiceResultFactory.fail(UserMessages.unfollowFailed, HttpStatus.internalServerError);
        }

        return ServiceResultFactory.ok(UserMessages.unfollowed, undefined, HttpStatus.ok);
    }

    async getFollowers(dto: GetFollowersDto): Promise<ServiceResult<PaginatedListDto<UserDto>>> {
        const userExists = await this.userRepo.exists(dto.userId)
        if(!userExists){
            return ServiceResultFactory.fail<PaginatedListDto<UserDto>>(UserMessages.notFound, HttpStatus.notFound );
        }

        const result = await this.userFollowRepo.getFollowers(dto);
        const foundUsers = await this.userRepo.findByIds(result.followerIds);
        const usersById = foundUsers.reduce<Record<number, UserDto>>((acc, user) => {
            return {
            ...acc,
            [user.id]: UserMapper.toDto(user),
            };
        }, {});

         const usersDto = result.followerIds
            .map((id) => usersById[id])
            .filter((user): user is UserDto => user !== undefined);

        const data = new PaginatedListDto(
            usersDto,
            result.total,
            dto.page,
            dto.limit
        );

        return ServiceResultFactory.ok(UserMessages.followersFetchedSuccess, data, HttpStatus.ok);
    }

    async getFollowing(dto: GetFollowingDto): Promise<ServiceResult<PaginatedListDto<UserDto>>> {
        const userExists = await this.userRepo.exists(dto.userId)
        if(!userExists){
            return ServiceResultFactory.fail<PaginatedListDto<UserDto>>( UserMessages.notFound, HttpStatus.notFound);
        }

        const result = await this.userFollowRepo.getFollowing(dto);
        const foundUsers = await this.userRepo.findByIds(result.followingIds);
        const usersById = foundUsers.reduce<Record<number, UserDto>>((acc, user) => {
            return {
            ...acc,
            [user.id]: UserMapper.toDto(user),
            };
        }, {});

        const usersDto = result.followingIds
            .map((id) => usersById[id])
            .filter((user): user is UserDto => user !== undefined);


        const data = new PaginatedListDto(
            usersDto,
            result.total,
            dto.page,
            dto.limit
        );

        return ServiceResultFactory.ok(UserMessages.followingFetchedSuccess, data, HttpStatus.ok);
    }

}
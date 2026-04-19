import { IUserService } from "../../Domain/services/users/IUserService";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { UserMapper } from "../../Shared/mappers/users/UserMapper";
import { GetUsersDto } from "../../Domain/DTOs/users/GetUsersDto";
import { PaginatedListDto } from "../../Domain/DTOs/common/PaginatedListDto";

export class UserService implements IUserService {
  public constructor(private readonly userRepo: IUserRepository) {}

  async getAll(dto:GetUsersDto): Promise<PaginatedListDto<UserDto>> {
    const items = await this.userRepo.findAll(dto);
    return new PaginatedListDto(
    items.users.map((u) => UserMapper.toDto(u)),
    items.total,
    dto.page,
    dto.limit
  );}

  async getById(id: number): Promise<UserDto | null> {
    const u = await this.userRepo.findById(id);
    if (u.id === 0) return null;
    return UserMapper.toDto(u);
    }

  async deactivate(id: number): Promise<boolean> {
    return this.userRepo.deactivate(id);
  }
  async exists(id: number): Promise<boolean> {
  const user = await this.userRepo.findById(id);
  return !!user && user.id !== 0;
}
}

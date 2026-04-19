import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";
import { GetUsersDto } from "../../DTOs/users/GetUsersDto";
import { UserDto } from "../../DTOs/users/UserDto";

export interface IUserService {
  getAll(dto:GetUsersDto): Promise<PaginatedListDto<UserDto>>;
  getById(id: number): Promise<UserDto | null>;
  deactivate(id: number): Promise<boolean>;
  exists(id:number):Promise<boolean>;
}

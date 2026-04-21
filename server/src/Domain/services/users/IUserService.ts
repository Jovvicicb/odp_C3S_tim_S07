import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";
import { GetUsersDto } from "../../DTOs/users/GetUsersDto";
import { UpdateMeDto } from "../../DTOs/users/UpdateMeDto";
import { UserDto } from "../../DTOs/users/UserDto";
import { AuditContext } from "../../types/audits/AuditContext";
import { UpdateMeResult } from "../../types/users/UpdateMeResult";

export interface IUserService {
  getAll(dto:GetUsersDto): Promise<PaginatedListDto<UserDto>>;
  getById(id: number): Promise<UserDto | null>;
  getByUsername(username:string): Promise<UserDto | null>;
  deactivate(id: number): Promise<boolean>;
  exists(id:number):Promise<boolean>;
  update(dto: UpdateMeDto,ctx:AuditContext): Promise<UpdateMeResult>;
}

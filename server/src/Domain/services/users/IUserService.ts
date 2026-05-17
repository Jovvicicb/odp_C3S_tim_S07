import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";
import { GetUsersDto } from "../../DTOs/users/GetUsersDto";
import { UpdateMeDto } from "../../DTOs/users/UpdateMeDto";
import { UserDto } from "../../DTOs/users/UserDto";
import { UserRole } from "../../enums/users/UserRole";
import { AuditContext } from "../../types/audits/AuditContext";
import { ServiceResult } from "../../types/service/ServiceResult";

export interface IUserService {
  getAll(dto:GetUsersDto): Promise<ServiceResult<PaginatedListDto<UserDto>>>;
  getById(id: number): Promise<ServiceResult<UserDto>>;
  getByUsername(username:string): Promise<ServiceResult<UserDto>>;
  exists(id:number):Promise<boolean>;
  update(dto: UpdateMeDto,ctx:AuditContext): Promise<ServiceResult>;
  updateRole(id: number, role: UserRole,ctx:AuditContext): Promise<ServiceResult>;
}

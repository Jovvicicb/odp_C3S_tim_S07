import { GetUsersDto } from "../../DTOs/users/GetUsersDto";
import { UpdateMeDto } from "../../DTOs/users/UpdateMeDto";
import { UserRole } from "../../enums/users/UserRole";
import { User } from "../../models/User";

export interface IUserRepository {
  findById(id: number): Promise<User>;
  findByIds(ids: number[]): Promise<User[]>;
  findByUsername(username: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(dto:GetUsersDto):Promise<{users:User[];total:number}>;
  create(user: User): Promise<User>;
  update(userId: number, dto: UpdateMeDto): Promise<boolean>;
  exists(id: number): Promise<boolean>;
  updateRole(id: number, role: UserRole): Promise<boolean>;
}

import { GetUsersDto } from "../../DTOs/users/GetUsersDto";
import { User } from "../../models/User";

export interface IUserRepository {
  findById(id: number): Promise<User>;
  findByUsername(username: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(dto:GetUsersDto):Promise<{users:User[];total:number}>;
  create(user: User): Promise<User>;
  update(user: User): Promise<boolean>;
  deactivate(id: number): Promise<boolean>;
}

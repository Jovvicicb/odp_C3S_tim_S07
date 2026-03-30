import { User } from "../../models/User";

export interface IUserRepository {
  findById(id: number): Promise<User>;
  findByUsername(username: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(): Promise<User[]>;
  create(user: User): Promise<User>;
  update(user: User): Promise<boolean>;
  deactivate(id: number): Promise<boolean>;
}

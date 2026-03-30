import type { AuthResponse } from "../../types/auth/AuthResponse";

export interface IAuthAPIService {
  login(username: string, password: string): Promise<AuthResponse>;
  register(username: string, email: string, password: string, role: string): Promise<AuthResponse>;
}

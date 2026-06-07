import type { AuthResponse } from "../../types/auth/AuthResponse";
import type { ApiResponse } from "../../types/common/ApiResponse";

export interface IAuthAPIService {
  login(username: string, password: string): Promise<AuthResponse>;
  register(formData: FormData): Promise<AuthResponse>;
  logout(token: string): Promise<ApiResponse<void>>;
}

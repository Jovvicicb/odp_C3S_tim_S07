import axios from "axios";
import type { AuthResponse } from "../../types/auth/AuthResponse";
import type { IAuthAPIService } from "./IAuthAPIService";

const BASE = import.meta.env.VITE_API_URL + "auth";
const err = (e: unknown, fallback: string): AuthResponse => ({
  success: false,
  message: axios.isAxiosError(e) ? (e.response?.data as { message?: string })?.message ?? fallback : fallback,
});

export const authApi: IAuthAPIService = {
  async login(username, password) {
    return axios.post<AuthResponse>(`${BASE}/login`, { username, password })
      .then(r => r.data).catch(e => err(e, "Login failed"));
  },
  async register(username, email, password, role) {
    return axios.post<AuthResponse>(`${BASE}/register`, { username, email, password, role })
      .then(r => r.data).catch(e => err(e, "Registration failed"));
  },
};

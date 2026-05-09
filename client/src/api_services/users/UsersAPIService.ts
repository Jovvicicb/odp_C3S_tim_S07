import axios from "axios";
import type { IUsersAPIService } from "./IUsersAPIService";
import type { UserDto } from "../../models/user/UserTypes";
import { readItem } from "../../helpers/local_storage";
import type { PaginatedListDto } from "../../types/community/CommunityTypes";
import type { ApiResponse } from "../../types/common/ApiResponse";

const BASE = import.meta.env.VITE_API_URL + "users";

const authHeader = () => {
  const token = readItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const err = <T>(e: unknown, fallback: string): ApiResponse<T> => ({
  success: false,
  message: axios.isAxiosError(e) ? (e.response?.data as { message?: string })?.message ?? fallback : fallback,
});

export const usersApi: IUsersAPIService = {
  async getAll(page = 1, limit = 10) {
    return axios
      .get<ApiResponse<PaginatedListDto<UserDto>>>(`${BASE}/all`, {
        headers: authHeader(),
        params: { page, limit },
      })
      .then((r) => r.data)
      .catch((e) => err(e, "Failed to load users"));
  },

  async getById(id) {
    return axios.get<ApiResponse<UserDto>>(`${BASE}/${id}`, { headers: authHeader() })
      .then(r => r.data).catch(e => err(e, "Failed to load user"));
  },
  async deactivate(id) {
    return axios.patch<ApiResponse<void>>(`${BASE}/${id}/deactivate`, {}, { headers: authHeader() })
      .then(r => r.data).catch(e => err(e, "Failed to deactivate user"));
  },
};

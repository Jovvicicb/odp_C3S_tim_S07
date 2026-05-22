import axios from "axios";
import type { IUsersAPIService } from "./IUsersAPIService";
import type { UserDto } from "../../models/users/UserDto";
import { readItem } from "../../helpers/local_storage";
import type { ApiResponse } from "../../types/common/ApiResponse";
import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import { UserMessages } from "../../constants/messages/user/UserMessages";

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
      .catch((e) => err(e, UserMessages.fetchAllFailed));
  },

   async getById(id) {
    return axios
      .get<ApiResponse<UserDto>>(`${BASE}/${id}`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e) => err(e, UserMessages.fetchOneFailed));
  },

  async updateMe(formData) {
    return axios
      .put<ApiResponse<void>>(`${BASE}/me`, formData, {
        headers: {
          ...authHeader(),
        },
      })
      .then((r) => r.data)
      .catch((e) => err(e, UserMessages.updateFailed));
  },

  async updateRole(id, role) {
    return axios
      .put<ApiResponse<void>>(
        `${BASE}/${id}/role`,
        { role },
        { headers: authHeader() },
      )
      .then((r) => r.data)
      .catch((e) => err(e, UserMessages.roleUpdateFailed));
  },

  async follow(id) {
    return axios
      .post<ApiResponse<void>>(
        `${BASE}/${id}/follow`,
        {},
        { headers: authHeader() },
      )
      .then((r) => r.data)
      .catch((e) => err(e, UserMessages.followFailed));
  },

  async unfollow(id) {
    return axios
      .delete<ApiResponse<void>>(`${BASE}/${id}/follow`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e) => err(e, UserMessages.unfollowFailed));
  },

  async getFollowers(id, page = 1, limit = 10) {
    return axios
      .get<ApiResponse<PaginatedListDto<UserDto>>>(`${BASE}/${id}/followers`, {
        headers: authHeader(),
        params: { page, limit },
      })
      .then((r) => r.data)
      .catch((e) => err(e, UserMessages.followersFetchFailed));
  },

  async getFollowing(id, page = 1, limit = 10) {
    return axios
      .get<ApiResponse<PaginatedListDto<UserDto>>>(`${BASE}/${id}/following`, {
        headers: authHeader(),
        params: { page, limit },
      })
      .then((r) => r.data)
      .catch((e) => err(e, UserMessages.followingFetchFailed));
  },

  async removeFollower(id) {
    return axios
      .delete<ApiResponse<void>>(`${BASE}/${id}/follower`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e) => err(e, UserMessages.removeFollowerFailed));
  },

  async search(username, page = 1, limit = 10) {
    return axios
      .get<ApiResponse<PaginatedListDto<UserDto>>>(`${BASE}/search`, {
        headers: authHeader(),
        params: {
          username,
          page,
          limit,
        },
      })
      .then((r) => r.data)
      .catch((e) => err(e, UserMessages.searchFailed));
  },
};

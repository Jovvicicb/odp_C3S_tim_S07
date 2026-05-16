import axios from "axios";
import type { ICommunityAPIService } from "./ICommunityAPIService";
import type { ApiResponse } from "../../types/common/ApiResponse";
import { readItem } from "../../helpers/local_storage";
import type { CreateCommunityResponseDto } from "../../models/community/CreateCommunityResponseDto ";
import { CommunityMessages } from "../../constants/messages/community/CommunityMessages";
import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { CommunityDto } from "../../models/community/CommunityDto";

const BASE = import.meta.env.VITE_API_URL + "communities";

const authHeader = () => {
  const token = readItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const err = <T>(e: unknown, fallback: string): ApiResponse<T> => ({
  success: false,
  message: axios.isAxiosError(e)
    ? (e.response?.data as { message?: string })?.message ?? fallback
    : fallback,
});

export const communityApi: ICommunityAPIService = {
  async create(formData) {
    return axios
      .post<ApiResponse<CreateCommunityResponseDto>>(BASE, formData, {
        headers: {
          ...authHeader(),
        },
      })
      .then((r) => r.data)
      .catch((e) => err(e, CommunityMessages.createFailed));
  },

   async getAll(page = 1, limit = 10) {
    return axios
      .get<ApiResponse<PaginatedListDto<CommunityDto>>>(`${BASE}/all`, {
        headers: authHeader(),
        params: { page, limit },
      })
      .then((r) => r.data)
      .catch((e) => err(e, CommunityMessages.fetchAllFailed));
  },

  async getMine(page = 1, limit = 10) {
    return axios
      .get<ApiResponse<PaginatedListDto<CommunityDto>>>(`${BASE}/mine`, {
        headers: authHeader(),
        params: { page, limit },
      })
      .then((r) => r.data)
      .catch((e) => err(e, CommunityMessages.fetchAllFailed));
  },

  async getPublic(page = 1, limit = 10) {
    return axios
      .get<ApiResponse<PaginatedListDto<CommunityDto>>>(BASE, {
        headers: authHeader(),
        params: { page, limit },
      })
      .then((r) => r.data)
      .catch((e) => err(e, CommunityMessages.fetchAllFailed));
  },
  
  async join(id) {
  return axios
    .post<ApiResponse<void>>(`${BASE}/${id}/join`, {}, { headers: authHeader() })
    .then((r) => r.data)
    .catch((e) => err(e, CommunityMessages.joinFailed));
},

async leave(id) {
  return axios
    .delete<ApiResponse<void>>(`${BASE}/${id}/leave`, { headers: authHeader() })
    .then((r) => r.data)
    .catch((e) => err(e, CommunityMessages.leaveFailed));
},
};
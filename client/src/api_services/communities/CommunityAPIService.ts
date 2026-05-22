import axios from "axios";
import type { ICommunityAPIService } from "./ICommunityAPIService";
import type { ApiResponse } from "../../types/common/ApiResponse";
import { readItem } from "../../helpers/local_storage";
import type { CreateCommunityResponseDto } from "../../models/communities/CreateCommunityResponseDto";
import { CommunityMessages } from "../../constants/messages/community/CommunityMessages";
import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { CommunityDto } from "../../models/communities/CommunityDto";
import type { CommunityDetailsDto } from "../../models/communities/CommunityDetailsDto";
import type { CommunityMemberDetailsDto } from "../../models/communities/CommunityMemberDetailsDto";

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

  async discover(page = 1, limit = 10, type = "all", search = "") {
    return axios
      .get<ApiResponse<PaginatedListDto<CommunityDto>>>(`${BASE}/discover`, {
        headers: authHeader(),
        params: {
          page,
          limit,
          type,
          search,
        },
      })
      .then((r) => r.data)
      .catch((e) => err(e, CommunityMessages.discoverFetchFailed));
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

  async getById(id, membersPage = 1, membersLimit = 10) {
    return axios
      .get<ApiResponse<CommunityDetailsDto>>(`${BASE}/${id}`, {
        headers: authHeader(),
        params: {
          page: membersPage,
          limit: membersLimit,
        },
      })
      .then((r) => r.data)
      .catch((e) => err(e, CommunityMessages.fetchOneFailed));
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

  async getJoinRequests(communityId, page = 1, limit = 10) {
    return axios
      .get<ApiResponse<PaginatedListDto<CommunityMemberDetailsDto>>>(
        `${BASE}/${communityId}/join-requests`,
        {
          headers: authHeader(),
          params: { page, limit },
        },
      )
      .then((r) => r.data)
      .catch((e) => err(e, CommunityMessages.joinRequestsFetchFailed));
  },

  async updateMemberRole(communityId, userId, role) {
    return axios
      .patch<ApiResponse<void>>(
        `${BASE}/${communityId}/members/${userId}/role`,
        { role },
        { headers: authHeader() },
      )
      .then((r) => r.data)
      .catch((e) => err(e, CommunityMessages.updateMemberRoleFailed));
  },

  async updateMemberStatus(communityId, userId, action) {
    return axios
      .patch<ApiResponse<void>>(
        `${BASE}/${communityId}/members/${userId}/status`,
        { action },
        { headers: authHeader() },
      )
      .then((r) => r.data)
      .catch((e) => err(e, CommunityMessages.updateMemberStatusFailed));
  },

  async removeMember(communityId, userId) {
    return axios
      .delete<ApiResponse<void>>(`${BASE}/${communityId}/members/${userId}`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e) => err(e, CommunityMessages.removeMemberFailed));
  },
};
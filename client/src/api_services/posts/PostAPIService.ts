import axios from "axios";
import type { IPostAPIService } from "./IPostAPIService";
import type { ApiResponse } from "../../types/common/ApiResponse";
import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import { readItem } from "../../helpers/local_storage";
import type { PostWithDetailsDto } from "../../models/posts/PostWithDetailsDto";
import { PostMessages } from "../../constants/messages/post/PostMessages";
import type { PostDto } from "../../models/posts/PostDto";
import type { PostDetailsDto } from "../../models/posts/PostDetailsDto";
import type { CommentSortType } from "../../types/comments/CommentSortType";

const BASE = import.meta.env.VITE_API_URL + "posts";

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

export const postApi: IPostAPIService = {
  async create(formData) {
    return axios
      .post<ApiResponse<PostDto>>(BASE, formData, {
        headers: {
          ...authHeader(),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((r) => r.data)
      .catch((e) => err(e, PostMessages.createFailed));
  },

  async getByCommunity(communityId, page = 1, limit = 10, sort = "newest") {
    return axios
      .get<ApiResponse<PaginatedListDto<PostWithDetailsDto>>>(
        `${BASE}/community/${communityId}`,
        {
          headers: authHeader(),
          params: {
            page,
            limit,
            sort,
          },
        },
      )
      .then((r) => r.data)
      .catch((e) => err(e, PostMessages.fetchByCommunityFailed));
  },

   async getById(id: number, commentsPage = 1, commentsLimit = 10, commentsSort: CommentSortType = "newest",) {
      return axios
        .get<ApiResponse<PostDetailsDto>>(`${BASE}/${id}`, {
          headers: authHeader(),
          params: {
            commentsPage,
            commentsLimit,
            commentsSort,
          },
        })
        .then((r) => r.data)
        .catch((e) => err(e, PostMessages.fetchDetailsFailed));
  },

  async like(id: number) {
    return axios
      .post<ApiResponse<void>>(`${BASE}/${id}/like`, {}, { headers: authHeader() })
      .then((r) => r.data)
      .catch((e) => err(e, PostMessages.likeFailed));
  },

  async unlike(id: number) {
    return axios
      .delete<ApiResponse<void>>(`${BASE}/${id}/like`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e) => err(e, PostMessages.unlikeFailed));
  },

  async delete(id: number) {
    return axios
      .delete<ApiResponse<void>>(`${BASE}/${id}`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e) => err(e, PostMessages.deleteFailed));
  },
    
};
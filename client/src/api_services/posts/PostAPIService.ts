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
import {
  getApiErrorMessage,
  type ApiClientError,
} from "../../helpers/api/ApiErrorHelper";

const BASE = import.meta.env.VITE_API_URL + "posts";

const authHeader = () => {
  const token = readItem("authToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const err = <T>(e: ApiClientError, fallback: string): ApiResponse<T> => ({
  success: false,
  message: getApiErrorMessage(e, fallback),
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
      .catch((e: ApiClientError) => err(e, PostMessages.createFailed));
  },


  async update(id, formData) {
    return axios
      .put<ApiResponse<void>>(`${BASE}/${id}`, formData, {
        headers: {
          ...authHeader(),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, PostMessages.updateFailed));
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
      .catch((e: ApiClientError) =>
        err(e, PostMessages.fetchByCommunityFailed),
      );
  },
    
  async getByUser(userId) {
    return axios
      .get<ApiResponse<PostWithDetailsDto[]>>(`${BASE}/user/${userId}`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, PostMessages.fetchByUserFailed));
  },

  async getById(
    id,
    commentsPage = 1,
    commentsLimit = 10,
    commentsSort: CommentSortType = "newest",
  ) {
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
      .catch((e: ApiClientError) => err(e, PostMessages.fetchDetailsFailed));
  },

  async like(id) {
    return axios
      .post<ApiResponse<void>>(
        `${BASE}/${id}/like`,
        {},
        {
          headers: authHeader(),
        },
      )
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, PostMessages.likeFailed));
  },

  async unlike(id) {
    return axios
      .delete<ApiResponse<void>>(`${BASE}/${id}/like`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, PostMessages.unlikeFailed));
  },

  async delete(id) {
    return axios
      .delete<ApiResponse<void>>(`${BASE}/${id}`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, PostMessages.deleteFailed));
  },

  async addTag(postId, tagId) {
    return axios
      .post<ApiResponse<void>>(
        `${BASE}/${postId}/tags`,
        {
          tagId,
        },
        {
          headers: authHeader(),
        },
      )
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, PostMessages.addTagFailed));
  },
  
  async removeTag(postId, tagId) {
    return axios
      .delete<ApiResponse<void>>(`${BASE}/${postId}/tags/${tagId}`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, PostMessages.removeTagFailed));
  },

  async getFeed(page = 1, limit = 10) {
    return axios
      .get<ApiResponse<PaginatedListDto<PostWithDetailsDto>>>(`${BASE}/feed`, {
        headers: authHeader(),
        params: {
          page,
          limit,
        },
      })
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, PostMessages.feedFetchFailed));
  },

  async getAllForAdmin(page = 1, limit = 10) {
    return axios
      .get<ApiResponse<PaginatedListDto<PostWithDetailsDto>>>(
        `${BASE}/admin/all`,
        {
          headers: authHeader(),
          params: {
            page,
            limit,
          },
        },
      )
      .then((r) => r.data)
      .catch((e: ApiClientError) =>
        err(e, PostMessages.fetchAdminPostsFailed),
      );
  },
};
import axios from "axios";
import type { ICommentAPIService } from "./ICommentAPIService";
import type { ApiResponse } from "../../types/common/ApiResponse";
import { readItem } from "../../helpers/local_storage";
import { CommentMessages } from "../../constants/messages/comment/CommentMessages";
import {
  getApiErrorMessage,
  type ApiClientError,
} from "../../helpers/api/ApiErrorHelper";
import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { UserProfileCommentDto } from "../../models/comments/UserProfileCommentDto";

const BASE = import.meta.env.VITE_API_URL + "comments";

const authHeader = () => {
  const token = readItem("authToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const err = <T>(e: ApiClientError, fallback: string): ApiResponse<T> => ({
  success: false,
  message: getApiErrorMessage(e, fallback),
});

export const commentApi: ICommentAPIService = {
  async create(postId, content, parentId = null) {
    return axios
      .post<ApiResponse<void>>(
        BASE,
        {
          postId,
          content,
          parentId,
        },
        {
          headers: authHeader(),
        },
      )
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, CommentMessages.createFailed));
  },

  async update(id, content) {
    return axios
      .put<ApiResponse<void>>(
        `${BASE}/${id}`,
        {
          content,
        },
        {
          headers: authHeader(),
        },
      )
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, CommentMessages.updateFailed));
  },

  async getByUser(userId, page = 1, limit = 10) {
    return axios
      .get<ApiResponse<PaginatedListDto<UserProfileCommentDto>>>(
        `${BASE}/user/${userId}`,
        {
          headers: authHeader(),
          params: {
            page,
            limit,
          },
        },
      )
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, CommentMessages.fetchByUserFailed));
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
      .catch((e: ApiClientError) => err(e, CommentMessages.likeFailed));
  },

  async unlike(id) {
    return axios
      .delete<ApiResponse<void>>(`${BASE}/${id}/like`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, CommentMessages.unlikeFailed));
  },

  async delete(id) {
    return axios
      .delete<ApiResponse<void>>(`${BASE}/${id}`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, CommentMessages.deleteFailed));
  },

  async flag(id) {
    return axios
      .patch<ApiResponse<void>>(
        `${BASE}/${id}/flag`,
        {},
        {
          headers: authHeader(),
        },
      )
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, CommentMessages.flagFailed));
  },

  async unflag(id) {
    return axios
      .patch<ApiResponse<void>>(
        `${BASE}/${id}/unflag`,
        {},
        {
          headers: authHeader(),
        },
      )
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, CommentMessages.unflagFailed));
  },
};
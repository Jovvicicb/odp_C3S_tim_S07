import axios from "axios";
import type { ICommentAPIService } from "./ICommentAPIService";
import type { ApiResponse } from "../../types/common/ApiResponse";
import { readItem } from "../../helpers/local_storage";
import { CommentMessages } from "../../constants/messages/comment/CommentMessages";

const BASE = import.meta.env.VITE_API_URL + "comments";

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
      .catch((e) => err(e, CommentMessages.createFailed));
  },

  async like(id: number) {
    return axios
      .post<ApiResponse<void>>(`${BASE}/${id}/like`, {}, { headers: authHeader() })
      .then((r) => r.data)
      .catch((e) => err(e, CommentMessages.likeFailed));
  },

  async unlike(id: number) {
    return axios
      .delete<ApiResponse<void>>(`${BASE}/${id}/like`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e) => err(e, CommentMessages.unlikeFailed));
  },


  async delete(id: number) {
    return axios
      .delete<ApiResponse<void>>(`${BASE}/${id}`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e) => err(e, CommentMessages.deleteFailed));
  },

  async flag(id: number) {
    return axios
      .patch<ApiResponse<void>>(`${BASE}/${id}/flag`, {}, { headers: authHeader() })
      .then((r) => r.data)
      .catch((e) => err(e, CommentMessages.flagFailed));
  },

  async unflag(id: number) {
    return axios
      .patch<ApiResponse<void>>(`${BASE}/${id}/unflag`, {}, { headers: authHeader() })
      .then((r) => r.data)
      .catch((e) => err(e, CommentMessages.unflagFailed));
  },
};
import axios from "axios";
import type { ITagAPIService } from "./ITagAPIService";
import type { ApiResponse } from "../../types/common/ApiResponse";
import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { TagDto } from "../../models/tags/TagDto";
import { readItem } from "../../helpers/local_storage";
import { TagMessages } from "../../constants/messages/tag/TagMessages";
import {
  getApiErrorMessage,
  type ApiClientError,
} from "../../helpers/api/ApiErrorHelper";

const BASE = import.meta.env.VITE_API_URL + "tags";

const authHeader = () => {
  const token = readItem("authToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const err = <T>(e: ApiClientError, fallback: string): ApiResponse<T> => ({
  success: false,
  message: getApiErrorMessage(e, fallback),
});

export const tagApi: ITagAPIService = {
  async getAll(page = 1, limit = 10) {
    return axios
      .get<ApiResponse<PaginatedListDto<TagDto>>>(BASE, {
        headers: authHeader(),
        params: {
          page,
          limit,
        },
      })
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, TagMessages.fetchAllFailed));
  },

  async create(name) {
    return axios
      .post<ApiResponse<TagDto>>(
        BASE,
        {
          name,
        },
        {
          headers: authHeader(),
        },
      )
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, TagMessages.createFailed));
  },

  async delete(id) {
    return axios
      .delete<ApiResponse<void>>(`${BASE}/${id}`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, TagMessages.deleteFailed));
  },
};
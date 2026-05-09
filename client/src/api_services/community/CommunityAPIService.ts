import axios from "axios";
import type { ICommunityAPIService } from "./ICommunityAPIService";
import type { ApiResponse } from "../../types/common/ApiResponse";
import { readItem } from "../../helpers/local_storage";
import type { CreateCommunityResponseDto } from "../../models/community/CreateCommunityResponseDto ";
import { CommunityMessages } from "../../constants/messages/community/CommunityMessages";

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
};
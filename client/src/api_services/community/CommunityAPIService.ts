// TODO: Update BASE path to match your actual API route (e.g. "orders", "products", etc.)
import axios from "axios";
import type {ICommunityAPIService } from "./ICommunityAPIService";
import type { CommunityDto } from "../../models/community/CommunityDto";
import { readItem } from "../../helpers/local_storage";
import type { PaginatedListDto,ApiResponse,CommunityType } from "../../types/community/CommunityTypes";


const BASE = import.meta.env.VITE_API_URL + "communities";

const authHeader = () => {
  const token = readItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const err = <T>(e: unknown, fallback: string): ApiResponse<T> => ({
  success: false,
  message: axios.isAxiosError(e) ? (e.response?.data as { message?: string })?.message ?? fallback : fallback,
});

export const communityApi: ICommunityAPIService = {
  async getAll(page = 1, limit = 20,type?:CommunityType) {
    return axios.get<ApiResponse<PaginatedListDto<CommunityDto>>>(`${BASE}?page=${page}&limit=${limit}${type ? `&type=${type}` : ""}`, { headers: authHeader() })
      .then(r => r.data).catch(e => err(e, "Failed to load items"));
  },
  async getById(id) {
    return axios.get<ApiResponse<CommunityDto>>(`${BASE}/${id}`, { headers: authHeader() })
      .then(r => r.data).catch(e => err(e, "Failed to load item"));
  },
  async getByUserId(userId,page=1,limit=10) {
    return axios.get<ApiResponse<PaginatedListDto<CommunityDto>>>(`${BASE}/user/${userId}?page=${page}&limit=${limit}`, { headers: authHeader() })
      .then(r => r.data).catch(e => err(e, "Failed to load items"));
  },
  async create(formData: FormData) {
    return axios.post<ApiResponse<CommunityDto>>(BASE, formData, { headers: authHeader() })
      .then(r => r.data).catch(e => err(e, "Failed to create"));
  },
  async update(id, payload) {
    return axios.patch<ApiResponse<void>>(`${BASE}/${id}`, payload, { headers: authHeader() })
      .then(r => r.data).catch(e => err(e, "Failed to update"));
  },
  async delete(id) {
    return axios.delete<ApiResponse<void>>(`${BASE}/${id}`, { headers: authHeader() })
      .then(r => r.data).catch(e => err(e, "Failed to delete"));
  },
};

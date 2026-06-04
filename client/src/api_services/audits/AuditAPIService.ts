import axios from "axios";

import type { IAuditAPIService } from "./IAuditAPIService";
import type { ApiResponse } from "../../types/common/ApiResponse";
import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { AuditDto } from "../../models/audits/AuditDto";

import { readItem } from "../../helpers/local_storage";
import {
  getApiErrorMessage,
  type ApiClientError,
} from "../../helpers/api/ApiErrorHelper";
import { AuditMessages } from "../../constants/messages/audit/AuditMessages";

const BASE = import.meta.env.VITE_API_URL + "audits";

const authHeader = () => {
  const token = readItem("authToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const err = <T>(e: ApiClientError, fallback: string): ApiResponse<T> => ({
  success: false,
  message: getApiErrorMessage(e, fallback),
});

export const auditApi: IAuditAPIService = {
  async getAll(page = 1, limit = 10) {
    return axios
      .get<ApiResponse<PaginatedListDto<AuditDto>>>(`${BASE}/logs`, {
        headers: authHeader(),
        params: {
          page,
          limit,
        },
      })
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, AuditMessages.fetchAllFailed));
  },
};
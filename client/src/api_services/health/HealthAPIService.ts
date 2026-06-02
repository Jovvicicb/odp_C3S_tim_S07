import axios from "axios";

import type { IHealthAPIService } from "./IHealthAPIService";
import type { ApiResponse } from "../../types/common/ApiResponse";
import type { DbNodeHealthDto } from "../../models/health/DbNodeHealthDto";

import { readItem } from "../../helpers/local_storage";
import {
  getApiErrorMessage,
  type ApiClientError,
} from "../../helpers/api/ApiErrorHelper";
import { HealthMessages } from "../../constants/messages/health/HealthMessages";
import type { ServerHealthDto } from "../../models/health/ServerHealthDto";

const BASE = import.meta.env.VITE_API_URL + "health";

const authHeader = () => {
  const token = readItem("authToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const err = <T>(e: ApiClientError, fallback: string): ApiResponse<T> => ({
  success: false,
  message: getApiErrorMessage(e, fallback),
});

export const healthApi: IHealthAPIService = {

  async getServerHealth() {
    return axios
      .get<ApiResponse<ServerHealthDto>>(BASE, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e: ApiClientError) =>
        err(e, HealthMessages.fetchServerHealthFailed),
      );
  },

  async getDbHealth() {
    return axios
      .get<ApiResponse<DbNodeHealthDto[]>>(`${BASE}/db`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, HealthMessages.fetchDbHealthFailed));
  },

  async triggerFailover() {
    return axios
      .post<ApiResponse<DbNodeHealthDto>>(
        `${BASE}/failover`,
        {},
        {
          headers: authHeader(),
        },
      )
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, HealthMessages.failoverFailed));
  },
};
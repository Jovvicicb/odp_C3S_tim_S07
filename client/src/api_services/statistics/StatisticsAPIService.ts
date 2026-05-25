import axios from "axios";

import type { IStatisticsAPIService } from "./IStatisticsAPIService";
import type { ApiResponse } from "../../types/common/ApiResponse";
import type { StatisticsDto } from "../../models/statistics/StatisticsDto";

import { readItem } from "../../helpers/local_storage";
import {
  getApiErrorMessage,
  type ApiClientError,
} from "../../helpers/api/ApiErrorHelper";

const BASE = import.meta.env.VITE_API_URL + "statistics";

const authHeader = () => {
  const token = readItem("authToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const err = <T>(e: ApiClientError, fallback: string): ApiResponse<T> => ({
  success: false,
  message: getApiErrorMessage(e, fallback),
});

export const statisticsApi: IStatisticsAPIService = {
  async getDashboardStatistics() {
    return axios
      .get<ApiResponse<StatisticsDto>>(`${BASE}/dashboard`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e: ApiClientError) =>
        err(e, "Failed to fetch dashboard statistics"),
      );
  },
};
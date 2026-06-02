import axios from "axios";

import type { IStatisticsAPIService } from "./IStatisticsAPIService";
import type { ApiResponse } from "../../types/common/ApiResponse";
import type { AdminStatisticsDto } from "../../models/statistics/AdminStatisticsDto";
import type { StatisticsDto } from "../../models/statistics/StatisticsDto";

import { readItem } from "../../helpers/local_storage";
import {
  getApiErrorMessage,
  type ApiClientError,
} from "../../helpers/api/ApiErrorHelper";
import { StatisticsMessages } from "../../constants/messages/statistics/StatisticsMessages";

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
        err(e, StatisticsMessages.fetchDashboardStatisticsFailed),
      );
  },

  async getAdminDashboardStatistics() {
    return axios
      .get<ApiResponse<AdminStatisticsDto>>(`${BASE}/admin/dashboard`, {
        headers: authHeader(),
      })
      .then((r) => r.data)
      .catch((e: ApiClientError) =>
        err(e, StatisticsMessages.fetchAdminDashboardStatisticsFailed),
      );
  },
};
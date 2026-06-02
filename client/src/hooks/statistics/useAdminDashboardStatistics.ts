import { useCallback, useEffect, useState } from "react";

import { statisticsApi } from "../../api_services/statistics/StatisticsAPIService";
import { StatisticsMessages } from "../../constants/messages/statistics/StatisticsMessages";
import type { AdminStatisticsDto } from "../../models/statistics/AdminStatisticsDto";

export function useAdminDashboardStatistics() {
  const [statistics, setStatistics] = useState<AdminStatisticsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await statisticsApi.getAdminDashboardStatistics();

      if (!res.success || !res.data) {
        setError(
          res.message ??
            StatisticsMessages.fetchAdminDashboardStatisticsFailed,
        );
        setStatistics(null);
        return;
      }

      setStatistics(res.data);
    } catch {
      setError(StatisticsMessages.fetchAdminDashboardStatisticsFailed);
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  return {
    statistics,
    loading,
    error,
    reload: load,
  };
}
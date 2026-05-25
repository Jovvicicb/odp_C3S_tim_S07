import { useCallback, useEffect, useState } from "react";

import { statisticsApi } from "../../api_services/statistics/StatisticsAPIService";
import type { StatisticsDto } from "../../models/statistics/StatisticsDto";

export function useDashboardStatistics() {
  const [statistics, setStatistics] = useState<StatisticsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await statisticsApi.getDashboardStatistics();

      if (!res.success || !res.data) {
        setError(res.message ?? "Failed to fetch dashboard statistics");
        setStatistics(null);
        return;
      }

      setStatistics(res.data);
    } catch {
      setError("Failed to fetch dashboard statistics");
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
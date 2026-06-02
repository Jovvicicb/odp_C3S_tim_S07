import { useCallback, useEffect, useState } from "react";

import { healthApi } from "../../api_services/health/HealthAPIService";
import { HealthMessages } from "../../constants/messages/health/HealthMessages";
import type { DbNodeHealthDto } from "../../models/health/DbNodeHealthDto";

export function useDbHealth() {
  const [nodes, setNodes] = useState<DbNodeHealthDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await healthApi.getDbHealth();

      if (!res.success || !res.data) {
        setError(res.message ?? HealthMessages.fetchDbHealthFailed);
        setNodes([]);
        return;
      }

      setNodes(res.data);
    } catch {
      setError(HealthMessages.fetchDbHealthFailed);
      setNodes([]);
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
    nodes,
    loading,
    error,
    reload: load,
  };
}
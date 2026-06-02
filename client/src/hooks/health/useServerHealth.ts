import { useCallback, useEffect, useState } from "react";

import { healthApi } from "../../api_services/health/HealthAPIService";
import { HealthMessages } from "../../constants/messages/health/HealthMessages";
import type { ServerHealthDto } from "../../models/health/ServerHealthDto";

export function useServerHealth() {
  const [serverHealth, setServerHealth] = useState<ServerHealthDto | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const testConnection = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await healthApi.getServerHealth();

      if (!res.success || !res.data) {
        setError(res.message ?? HealthMessages.fetchServerHealthFailed);
        setServerHealth(null);
        return;
      }

      setServerHealth(res.data);
    } catch {
      setError(HealthMessages.fetchServerHealthFailed);
      setServerHealth(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void testConnection();
    });
  }, [testConnection]);

  return {
    serverHealth,
    loading,
    error,
    testConnection,
  };
}
import { useState } from "react";

import { healthApi } from "../../api_services/health/HealthAPIService";
import { HealthMessages } from "../../constants/messages/health/HealthMessages";
import { useToast } from "../toast/useToast";

type Props = {
  reloadHealth: () => Promise<void>;
};

export function useHealthFailover({ reloadHealth }: Props) {
  const { showToast } = useToast();

  const [loadingFailover, setLoadingFailover] = useState(false);
  const [failoverError, setFailoverError] = useState("");

  const triggerFailover = async () => {
    setLoadingFailover(true);
    setFailoverError("");

    try {
      const res = await healthApi.triggerFailover();

      if (!res.success) {
        setFailoverError(res.message ?? HealthMessages.failoverFailed);
        return;
      }

      showToast({
        type: "success",
        message: res.message ?? HealthMessages.failoverSuccess,
      });

      await reloadHealth();
    } catch {
      setFailoverError(HealthMessages.failoverFailed);
    } finally {
      setLoadingFailover(false);
    }
  };

  return {
    triggerFailover,
    loadingFailover,
    failoverError,
  };
}
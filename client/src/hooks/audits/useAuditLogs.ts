import { useCallback, useEffect, useState } from "react";

import { auditApi } from "../../api_services/audits/AuditAPIService";
import { AuditMessages } from "../../constants/messages/audit/AuditMessages";

import type { AuditDto } from "../../models/audits/AuditDto";
import type { PaginatedListDto } from "../../models/common/PaginatedListDto";

const createEmptyAudits = (
  page: number,
  limit: number,
): PaginatedListDto<AuditDto> => ({
  items: [],
  total: 0,
  page,
  limit,
});

export function useAuditLogs(initialPage = 1, initialLimit = 10) {
  const [audits, setAudits] = useState<PaginatedListDto<AuditDto>>(
    createEmptyAudits(initialPage, initialLimit),
  );

  const [page, setPageState] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAudits = useCallback(
    async (targetPage: number, signal?: AbortSignal) => {
      setLoading(true);
      setError("");

      try {
        const res = await auditApi.getAll(targetPage, limit);

        if (signal?.aborted) return;

        if (!res.success || !res.data) {
          setError(res.message ?? AuditMessages.fetchAllFailed);
          setAudits(createEmptyAudits(targetPage, limit));
          return;
        }

        setAudits(res.data);
      } catch {
        if (signal?.aborted) return;

        setError(AuditMessages.fetchAllFailed);
        setAudits(createEmptyAudits(targetPage, limit));
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [limit],
  );

  useEffect(() => {
    const controller = new AbortController();

    queueMicrotask(() => {
      void loadAudits(page, controller.signal);
    });

    return () => {
      controller.abort();
    };
  }, [page, loadAudits]);

  const reload = useCallback(async () => {
    await loadAudits(page);
  }, [page, loadAudits]);

  const setPage = (nextPage: number) => {
    if (nextPage === page) return;

    setPageState(nextPage);
  };

  return {
    audits,
    page,
    limit,
    loading,
    error,
    setPage,
    reload,
  };
}
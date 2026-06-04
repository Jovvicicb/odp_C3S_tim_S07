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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAudits = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await auditApi.getAll(page, limit);

      if (!res.success || !res.data) {
        setAudits(createEmptyAudits(page, limit));
        setError(res.message ?? AuditMessages.fetchAllFailed);
        return;
      }

      setAudits(res.data);
    } catch {
      setAudits(createEmptyAudits(page, limit));
      setError(AuditMessages.fetchAllFailed);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchAudits();
    });
  }, [fetchAudits]);

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
    reload: fetchAudits,
  };
}
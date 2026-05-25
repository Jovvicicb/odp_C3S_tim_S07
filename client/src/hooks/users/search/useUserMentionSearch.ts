import { useEffect, useMemo, useState } from "react";

import { usersApi } from "../../../api_services/users/UsersAPIService";
import type { UserDto } from "../../../models/users/UserDto";

export function useUserMentionSearch(query: string) {
  const normalizedQuery = useMemo(() => query.trim(), [query]);
  const shouldSearch = normalizedQuery.length >= 2;

  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!shouldSearch) {
      return;
    }

    let cancelled = false;

    const timeoutId = window.setTimeout(async () => {
      setLoading(true);

      try {
        const res = await usersApi.search(normalizedQuery, 1, 5);

        if (cancelled) {
          return;
        }

        setUsers(res.success && res.data ? res.data.items : []);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [normalizedQuery, shouldSearch]);

  return {
    users: shouldSearch ? users : [],
    loading: shouldSearch ? loading : false,
  };
}
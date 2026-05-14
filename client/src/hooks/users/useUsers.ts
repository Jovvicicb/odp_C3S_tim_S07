import { useEffect, useState, useCallback } from "react";
import { usersApi } from "../../api_services/users/UsersAPIService";
import type { UserDto } from "../../models/user/UserDto";
import { UserMessages } from "../../constants/messages/user/UserMessages";

export function useUsers(initialPage = 1, initialLimit = 10) {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async (pageValue: number, limitValue: number) => {
    setLoading(true);
    setError("");

    try {
      const res = await usersApi.getAll(pageValue, limitValue);

      if (!res.success || !res.data) {
        setUsers([]);
        setTotal(0);
        setError(res.message ?? UserMessages.fetchAllFailed);
        return;
      }

      setUsers(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    } catch {
      setUsers([]);
      setTotal(0);
      setError(UserMessages.fetchAllFailed);
    } finally {
      setLoading(false);
    }
  }, []);

    useEffect(() => {
    queueMicrotask(() => {
        void fetchUsers(page, limit);
    });
    }, [page, limit, fetchUsers]);

 return {
  users,
  setUsers,
  loading,
  error,
  page,
  limit,
  total,
  setPage,
  setLimit,
  reload: () => fetchUsers(page, limit),
};
}
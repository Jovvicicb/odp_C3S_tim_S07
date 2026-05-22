import { useCallback, useEffect, useState } from "react";
import { usersApi } from "../../api_services/users/UsersAPIService";
import { UserMessages } from "../../constants/messages/user/UserMessages";
import type { UserDto } from "../../models/users/UserDto";

export function useSearchUsers(initialPage = 1, initialLimit = 10) {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const searchUsers = useCallback(async () => {
    const normalizedUsername = username.trim();

    if (!normalizedUsername) {
      setUsers([]);
      setTotal(0);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await usersApi.search(normalizedUsername, page, limit);

      if (!res.success || !res.data) {
        setUsers([]);
        setTotal(0);
        setError(res.message ?? UserMessages.searchFailed);
        return;
      }

      setUsers(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    } catch {
      setUsers([]);
      setTotal(0);
      setError(UserMessages.searchFailed);
    } finally {
      setLoading(false);
    }
  }, [username, page, limit]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void searchUsers();
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchUsers]);

  return {
    users,
    setUsers,
    loading,
    error,
    username,
    page,
    limit,
    total,
    setUsername,
    setPage,
    setLimit,
    setTotal,
    reload: searchUsers,
  };
}
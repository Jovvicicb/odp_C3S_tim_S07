import { useCallback, useEffect, useState } from "react";
import { usersApi } from "../../api_services/users/UsersAPIService";
import { UserMessages } from "../../constants/messages/user/UserMessages";
import type { UserDto } from "../../models/user/UserDto";

type ListType = "followers" | "following";

export function useUserFollowList(
  userId: number | null,
  listType: ListType,
  initialPage = 1,
  initialLimit = 10,
) {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    if (!userId) {
      setUsers([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res =
        listType === "followers"
          ? await usersApi.getFollowers(userId, page, limit)
          : await usersApi.getFollowing(userId, page, limit);

      if (!res.success || !res.data) {
        setUsers([]);
        setTotal(0);
        setError(
          res.message ??
            (listType === "followers"
              ? UserMessages.followersFetchFailed
              : UserMessages.followingFetchFailed),
        );
        return;
      }

      setUsers(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    } catch {
      setUsers([]);
      setTotal(0);
      setError(
        listType === "followers"
          ? UserMessages.followersFetchFailed
          : UserMessages.followingFetchFailed,
      );
    } finally {
      setLoading(false);
    }
  }, [userId, listType, page, limit]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchUsers();
    });
  }, [fetchUsers]);

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
    setTotal,
    reload: fetchUsers,
  };
}
import { useState } from "react";
import { usersApi } from "../../api_services/users/UsersAPIService";
import { CommonMessages } from "../../constants/messages/common/CommonMessages";
import { UserMessages } from "../../constants/messages/user/UserMessages";

export function useUserFollow() {
  const [loadingUserId, setLoadingUserId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const follow = async (userId: number) => {
    setLoadingUserId(userId);
    setError("");

    try {
      const res = await usersApi.follow(userId);

      if (!res.success) {
        setError(res.message ?? UserMessages.followFailed);
        return null;
      }

      return res.message ?? UserMessages.followed;
    } catch {
      setError(CommonMessages.unexpectedError);
      return null;
    } finally {
      setLoadingUserId(null);
    }
  };

  const unfollow = async (userId: number) => {
    setLoadingUserId(userId);
    setError("");

    try {
      const res = await usersApi.unfollow(userId);

      if (!res.success) {
        setError(res.message ?? UserMessages.unfollowFailed);
        return null;
      }

      return res.message ?? UserMessages.unfollowed;
    } catch {
      setError(CommonMessages.unexpectedError);
      return null;
    } finally {
      setLoadingUserId(null);
    }
  };

  return {
    follow,
    unfollow,
    loadingUserId,
    error,
    setError,
  };
}
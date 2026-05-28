import { useState } from "react";
import { usersApi } from "../../../api_services/users/UsersAPIService";
import { CommonMessages } from "../../../constants/messages/common/CommonMessages";
import { UserMessages } from "../../../constants/messages/user/UserMessages";

export function useRemoveFollower() {
  const [loadingUserId, setLoadingUserId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const removeFollower = async (userId: number) => {
    setLoadingUserId(userId);
    setError("");

    try {
      const res = await usersApi.removeFollower(userId);

      if (!res.success) {
        setError(res.message ?? UserMessages.removeFollowerFailed);
        return null;
      }

      return res.message ?? UserMessages.followerRemovedSuccessfully;
    } catch {
      setError(CommonMessages.unexpectedError);
      return null;
    } finally {
      setLoadingUserId(null);
    }
  };

  return {
    removeFollower,
    loadingUserId,
    error,
    setError,
  };
}
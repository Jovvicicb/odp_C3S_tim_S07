import { useCallback, useEffect, useState } from "react";

import { usersApi } from "../../api_services/users/UsersAPIService";
import { UserMessages } from "../../constants/messages/user/UserMessages";
import type { UserDto } from "../../models/users/UserDto";

export function useUserProfile(userId?: number) {
  const [profile, setProfile] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await usersApi.getById(userId);

      if (!res.success || !res.data) {
        setProfile(null);
        setError(res.message ?? UserMessages.fetchOneFailed);
        return;
      }

      setProfile(res.data);
    } catch {
      setProfile(null);
      setError(UserMessages.fetchOneFailed);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchProfile();
    });
  }, [fetchProfile]);

  return {
    profile,
    setProfile,
    loading,
    error,
    reload: fetchProfile,
  };
}
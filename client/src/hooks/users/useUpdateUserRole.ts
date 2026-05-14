import { useState } from "react";
import { usersApi } from "../../api_services/users/UsersAPIService";
import { CommonMessages } from "../../constants/messages/common/CommonMessages";
import { UserMessages } from "../../constants/messages/user/UserMessages";
import type { UserRole } from "../../types/user/UserRole";

export function useUpdateUserRole() {
  const [loadingUserId, setLoadingUserId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const updateRole = async (id: number, role: UserRole) => {
    setLoadingUserId(id);
    setError("");

    try {
      const res = await usersApi.updateRole(id, role);

      if (!res.success) {
        setError(res.message ?? UserMessages.roleUpdateFailed);
        return false;
      }

      return true;
    } catch {
      setError(CommonMessages.unexpectedError);
      return false;
    } finally {
      setLoadingUserId(null);
    }
  };

  return {
    updateRole,
    loadingUserId,
    error,
    setError,
  };
}
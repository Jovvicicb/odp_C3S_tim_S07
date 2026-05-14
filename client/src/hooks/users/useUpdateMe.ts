import { useState } from "react";
import { usersApi } from "../../api_services/users/UsersAPIService";
import { CommonMessages } from "../../constants/messages/common/CommonMessages";
import { UserMessages } from "../../constants/messages/user/UserMessages";

export function useUpdateMe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateMe = async (formData: FormData) => {
    setLoading(true);
    setError("");

    try {
      const res = await usersApi.updateMe(formData);

      if (!res.success) {
        setError(res.message ?? UserMessages.updateFailed);
        return false;
      }

      return true;
    } catch {
      setError(CommonMessages.unexpectedError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateMe,
    loading,
    error,
    setError,
  };
}
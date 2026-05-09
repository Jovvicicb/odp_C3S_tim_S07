import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { communityApi } from "../../api_services/community/CommunityAPIService";
import { CommunityMessages } from "../../constants/messages/community/CommunityMessages";
import { CommonMessages } from "../../constants/messages/common/CommonMessages";

export function useCreateCommunity() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const createCommunity = async (formData: FormData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await communityApi.create(formData);

      if (!res.success || !res.data) {
        setError(res.message ?? CommunityMessages.createFailed);
        return false;
      }

      setSuccess(CommunityMessages.createSuccess);

      setTimeout(() => {
        navigate(`/communities/${res.data?.id}`);
      }, 500);

      return true;
    } catch {
      setError(CommonMessages.unexpectedError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCommunity,
    loading,
    error,
    success,
    setError,
  };
}
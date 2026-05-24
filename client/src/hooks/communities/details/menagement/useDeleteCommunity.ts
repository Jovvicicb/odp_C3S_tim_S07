import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { communityApi } from "../../../../api_services/communities/CommunityAPIService";
import { CommunityMessages } from "../../../../constants/messages/community/CommunityMessages";
import { CommonMessages } from "../../../../constants/messages/common/CommonMessages";
import { useToast } from "../../../toast/useToast";

export function useDeleteCommunity() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loadingCommunityDelete, setLoadingCommunityDelete] = useState(false);
  const [communityDeleteError, setCommunityDeleteError] = useState("");

  const handleDeleteCommunity = async (communityId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this community? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setLoadingCommunityDelete(true);
    setCommunityDeleteError("");

    try {
      const res = await communityApi.delete(communityId);

      if (!res.success) {
        setCommunityDeleteError(res.message ?? CommunityMessages.deleteFailed);
        return;
      }

      showToast({
        type: "success",
        message: res.message ?? CommunityMessages.deleteSuccess,
      });

      navigate("/communities");
    } catch {
      setCommunityDeleteError(CommonMessages.unexpectedError);
    } finally {
      setLoadingCommunityDelete(false);
    }
  };

  return {
    handleDeleteCommunity,
    loadingCommunityDelete,
    communityDeleteError,
  };
}
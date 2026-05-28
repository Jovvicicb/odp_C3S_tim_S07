import { useState } from "react";

import { communityApi } from "../../../api_services/communities/CommunityAPIService";
import { CommonMessages } from "../../../constants/messages/common/CommonMessages";
import { CommunityMessages } from "../../../constants/messages/community/CommunityMessages";
import { notifyMyCommunitiesChanged } from "../../../helpers/events/SidebarEvents";

export function useUpdateCommunity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateCommunity = async (communityId: number, formData: FormData) => {
    setLoading(true);
    setError("");

    try {
      const res = await communityApi.update(communityId, formData);

      if (!res.success) {
        setError(res.message ?? CommunityMessages.updateFailed);
        return false;
      }

      notifyMyCommunitiesChanged();

      return true;
    } catch {
      setError(CommonMessages.unexpectedError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateCommunity,
    loading,
    error,
    setError,
  };
}
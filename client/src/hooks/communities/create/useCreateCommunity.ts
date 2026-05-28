import { useState } from "react";

import { communityApi } from "../../../api_services/communities/CommunityAPIService";
import { CommunityMessages } from "../../../constants/messages/community/CommunityMessages";
import { CommonMessages } from "../../../constants/messages/common/CommonMessages";
import { notifyMyCommunitiesChanged } from "../../../helpers/events/SidebarEvents";

export function useCreateCommunity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createCommunity = async (formData: FormData) => {
    setLoading(true);
    setError("");

    try {
      const res = await communityApi.create(formData);

      if (!res.success || !res.data) {
        setError(res.message ?? CommunityMessages.createFailed);
        return null;
      }

      notifyMyCommunitiesChanged();

      return res.data;
    } catch {
      setError(CommonMessages.unexpectedError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCommunity,
    loading,
    error,
    setError,
  };
}
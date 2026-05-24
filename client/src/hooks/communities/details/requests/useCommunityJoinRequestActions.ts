import { useState, type Dispatch, type SetStateAction } from "react";
import { communityApi } from "../../../../api_services/communities/CommunityAPIService";
import { CommunityMessages } from "../../../../constants/messages/community/CommunityMessages";
import type { CommunityMemberDetailsDto } from "../../../../models/communities/CommunityMemberDetailsDto";
import type { CommunityMemberStatusAction } from "../../../../types/communities/members/CommunityMemberStatusAction";
import { useToast } from "../../../toast/useToast";

type Props = {
  setRequests: Dispatch<SetStateAction<CommunityMemberDetailsDto[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  reloadDetails: () => Promise<void>;
};

export function useCommunityJoinRequestActions({
  setRequests,
  setTotal,
  reloadDetails,
}: Props) {
  const { showToast } = useToast();

  const [loadingJoinRequestUserId, setLoadingJoinRequestUserId] =
    useState<number | null>(null);

  const [joinRequestActionError, setJoinRequestActionError] = useState("");

  const handleJoinRequestStatus = async (
    communityId: number,
    userId: number,
    action: CommunityMemberStatusAction,
  ) => {
    setLoadingJoinRequestUserId(userId);
    setJoinRequestActionError("");

    try {
      const res = await communityApi.updateMemberStatus(
        communityId,
        userId,
        action,
      );

      if (!res.success) {
        setJoinRequestActionError(
          res.message ?? CommunityMessages.updateMemberStatusFailed,
        );
        return;
      }

      setRequests((current) =>
        current.filter((request) => request.user.id !== userId),
      );

      setTotal((current) => Math.max(0, current - 1));

      showToast({
        type: "success",
        message:
          res.message ??
          (action === "accept"
            ? "Join request accepted successfully"
            : "Join request denied successfully"),
      });

      if (action === "accept") {
        await reloadDetails();
      }
    } catch {
      setJoinRequestActionError(CommunityMessages.updateMemberStatusFailed);
    } finally {
      setLoadingJoinRequestUserId(null);
    }
  };

  return {
    handleJoinRequestStatus,
    loadingJoinRequestUserId,
    joinRequestActionError,
  };
}
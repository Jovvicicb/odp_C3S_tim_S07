import { useState, type Dispatch, type SetStateAction } from "react";
import { communityApi } from "../../../../api_services/communities/CommunityAPIService";
import { CommunityMessages } from "../../../../constants/messages/community/CommunityMessages";
import type { CommunityDetailsDto } from "../../../../models/communities/CommunityDetailsDto";
import type { CommunityMemberRole } from "../../../../types/communities/members/CommunityMemberRole";
import { useToast } from "../../../toast/useToast";

type Props = {
  setDetails: Dispatch<SetStateAction<CommunityDetailsDto | null>>;
  reloadDetails: () => Promise<void>;
};

export function useCommunityMemberModerationActions({
  setDetails,
  reloadDetails,
}: Props) {
  const { showToast } = useToast();

  const [loadingMemberActionUserId, setLoadingMemberActionUserId] =
    useState<number | null>(null);

  const [communityMemberError, setCommunityMemberError] = useState("");

  const handleCommunityRoleChange = async (
    communityId: number,
    userId: number,
    role: CommunityMemberRole,
  ) => {
    setLoadingMemberActionUserId(userId);
    setCommunityMemberError("");

    try {
      const res = await communityApi.updateMemberRole(
        communityId,
        userId,
        role,
      );

      if (!res.success) {
        setCommunityMemberError(
          res.message ?? CommunityMessages.updateMemberRoleFailed,
        );
        return;
      }

      setDetails((current) =>
        current
          ? {
              ...current,
              members: current.members
                ? {
                    ...current.members,
                    items: current.members.items.map((member) =>
                      member.user.id === userId
                        ? {
                            ...member,
                            communityRole: role,
                          }
                        : member,
                    ),
                  }
                : current.members,
            }
          : current,
      );

      showToast({
        type: "success",
        message: res.message ?? "Member role updated successfully",
      });

      await reloadDetails();
    } catch {
      setCommunityMemberError(CommunityMessages.updateMemberRoleFailed);
    } finally {
      setLoadingMemberActionUserId(null);
    }
  };

  const handleRemoveCommunityMember = async (
    communityId: number,
    userId: number,
  ) => {
    setLoadingMemberActionUserId(userId);
    setCommunityMemberError("");

    try {
      const res = await communityApi.removeMember(communityId, userId);

      if (!res.success) {
        setCommunityMemberError(
          res.message ?? CommunityMessages.removeMemberFailed,
        );
        return;
      }

      setDetails((current) =>
        current
          ? {
              ...current,
              members: current.members
                ? {
                    ...current.members,
                    items: current.members.items.filter(
                      (member) => member.user.id !== userId,
                    ),
                    total: Math.max(0, current.members.total - 1),
                  }
                : current.members,
            }
          : current,
      );

      showToast({
        type: "success",
        message: res.message ?? "Member removed successfully",
      });

      await reloadDetails();
    } catch {
      setCommunityMemberError(CommunityMessages.removeMemberFailed);
    } finally {
      setLoadingMemberActionUserId(null);
    }
  };

  return {
    handleCommunityRoleChange,
    handleRemoveCommunityMember,
    loadingMemberActionUserId,
    communityMemberError,
  };
}
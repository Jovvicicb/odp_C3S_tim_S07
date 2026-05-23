import { CommunityCard } from "../card/CommunityCard";
import type { CommunityDto } from "../../../models/communities/CommunityDto";

type Props = {
  communities: CommunityDto[];
  currentUserId: number | null;
  loadingCommunityId: number | null;
  onLeave: (communityId: number) => void;
};

export function MyCommunitiesList({
  communities,
  currentUserId,
  loadingCommunityId,
  onLeave,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-5">
      {communities.map((community) => (
        <CommunityCard
          key={community.id}
          community={community}
          currentUserId={currentUserId}
          membershipStatusOverride="active"
          showMembershipAction
          actionLoading={loadingCommunityId === community.id}
          onLeave={onLeave}
        />
      ))}
    </div>
  );
}

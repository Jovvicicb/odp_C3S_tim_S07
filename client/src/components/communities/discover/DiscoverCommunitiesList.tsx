import { CommunityCard } from "../card/CommunityCard";
import type { CommunityDto } from "../../../models/communities/CommunityDto";

type Props = {
  communities: CommunityDto[];
  currentUserId: number | null;
  loadingCommunityId: number | null;
  onJoin: (communityId: number) => void;
  onLeave: (communityId: number) => void;
};

export function DiscoverCommunitiesList({
  communities,
  currentUserId,
  loadingCommunityId,
  onJoin,
  onLeave,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-5">
      {communities.map((community) => (
        <CommunityCard
          key={community.id}
          community={community}
          currentUserId={currentUserId}
          showMembershipAction
          actionLoading={loadingCommunityId === community.id}
          onJoin={onJoin}
          onLeave={onLeave}
        />
      ))}
    </div>
  );
}

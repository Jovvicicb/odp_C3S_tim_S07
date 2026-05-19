import { CommunityCard } from "../CommunityCard";
import type { CommunityDto } from "../../../models/community/CommunityDto";

type Props = {
  communities: CommunityDto[];
  loadingCommunityId: number | null;
  onJoin: (communityId: number) => void;
  onLeave: (communityId: number) => void;
};

export function DiscoverCommunitiesList({
  communities,
  loadingCommunityId,
  onJoin,
  onLeave,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      {communities.map((community) => (
        <CommunityCard
          key={community.id}
          community={community}
          showMembershipAction
          actionLoading={loadingCommunityId === community.id}
          onJoin={onJoin}
          onLeave={onLeave}
        />
      ))}
    </div>
  );
}

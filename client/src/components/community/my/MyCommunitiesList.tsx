import { CommunityCard } from "../CommunityCard";
import type { CommunityDto } from "../../../models/community/CommunityDto";

type Props = {
  communities: CommunityDto[];
  loadingCommunityId: number | null;
  onLeave: (communityId: number) => void;
};

export function MyCommunitiesList({
  communities,
  loadingCommunityId,
  onLeave,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      {communities.map((community) => (
        <CommunityCard
          key={community.id}
          community={{
            ...community,
            membershipStatus: "active",
          }}
          showMembershipAction
          actionLoading={loadingCommunityId === community.id}
          onLeave={onLeave}
        />
      ))}
    </div>
  );
}

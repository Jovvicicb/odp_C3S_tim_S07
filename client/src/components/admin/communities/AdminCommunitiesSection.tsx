import type { CommunityDto } from "../../../models/communities/CommunityDto";

import { CommunityCard } from "../../communities/card/CommunityCard";
import { CountBadge } from "../../ui/CountBadge";
import { Pagination, Spinner } from "../../ui/UI";
import { SectionCard } from "../../ui/SectionCard";
import { SectionEmptyState } from "../../ui/SectionEmptyState";

type Props = {
  communities: CommunityDto[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function AdminCommunitiesSection({
  communities,
  loading,
  page,
  limit,
  total,
  onPageChange,
}: Props) {
  return (
    <SectionCard
      label="Community management"
      title="All communities"
      description="Review public and private communities across the platform and open community details when moderation is needed."
      action={
        <CountBadge count={total} singular="community" plural="communities" />
      }
    >
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={24} />
        </div>
      ) : communities.length === 0 ? (
        <SectionEmptyState
          title="No communities found."
          description="Communities will appear here after users create them."
        />
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>

          <div className="mt-6 border-t border-white/8 pt-5">
            <Pagination
              page={page}
              total={total}
              pageSize={limit}
              onChange={onPageChange}
            />
          </div>
        </>
      )}
    </SectionCard>
  );
}

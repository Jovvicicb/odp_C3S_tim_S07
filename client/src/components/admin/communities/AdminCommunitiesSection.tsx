import type { CommunityDto } from "../../../models/communities/CommunityDto";

import { CountBadge } from "../../ui/badge/CountBadge";
import { SectionCard } from "../../ui/card/SectionCard";
import { SectionEmptyState } from "../../ui/empty/SectionEmptyState";
import { Pagination } from "../../ui/pagination/Pagination";
import { Spinner } from "../../ui/spinner/Spinner";

import { CommunityCard } from "../../communities/card/CommunityCard";

type Props = {
  communities: CommunityDto[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  loadingCommunityId: number | null;
  onPageChange: (page: number) => void;
  onDelete: (communityId: number) => void;
};

export function AdminCommunitiesSection({
  communities,
  loading,
  page,
  limit,
  total,
  loadingCommunityId,
  onPageChange,
  onDelete,
}: Props) {
  return (
    <SectionCard
      label="Community management"
      title="All communities"
      description="Review public and private communities across the platform and remove communities when moderation is needed."
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
              <CommunityCard
                key={community.id}
                community={community}
                showDeleteAction
                deleteLoading={loadingCommunityId === community.id}
                onDelete={onDelete}
              />
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

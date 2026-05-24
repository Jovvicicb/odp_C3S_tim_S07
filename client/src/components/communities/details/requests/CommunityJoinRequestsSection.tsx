import { Pagination, Spinner } from "../../../ui/UI";
import { CountBadge } from "../../../ui/CountBadge";
import { SectionCard } from "../../../ui/SectionCard";
import { SectionEmptyState } from "../../../ui/SectionEmptyState";

import type { CommunityMemberDetailsDto } from "../../../../models/communities/CommunityMemberDetailsDto";

import { CommunityJoinRequestCard } from "./CommunityJoinRequestCard";

type Props = {
  requests: CommunityMemberDetailsDto[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  loadingUserId: number | null;
  setPage: (page: number) => void;
  onAccept: (userId: number) => void;
  onDeny: (userId: number) => void;
};

export function CommunityJoinRequestsSection({
  requests,
  loading,
  page,
  limit,
  total,
  loadingUserId,
  setPage,
  onAccept,
  onDeny,
}: Props) {
  const hasRequests = requests.length > 0;
  const showPagination = total > limit;

  return (
    <SectionCard
      label="Join requests"
      title="Pending membership requests"
      description="Review users waiting to join this private community and decide who should get access."
      action={<CountBadge count={total} singular="request" plural="requests" />}
    >
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={24} />
        </div>
      ) : !hasRequests ? (
        <SectionEmptyState
          title="No pending requests."
          description="New join requests will appear here when users ask to enter this private community."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {requests.map((request) => (
              <CommunityJoinRequestCard
                key={request.user.id}
                request={request}
                actionLoading={loadingUserId === request.user.id}
                onAccept={onAccept}
                onDeny={onDeny}
              />
            ))}
          </div>

          {showPagination && (
            <div className="mt-6">
              <Pagination
                page={page}
                total={total}
                pageSize={limit}
                onChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </SectionCard>
  );
}

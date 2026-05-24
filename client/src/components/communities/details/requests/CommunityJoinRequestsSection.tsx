import { Pagination, Spinner } from "../../../ui/UI";
import { SectionCard } from "../../../ui/SectionCard";

import type { CommunityMemberDetailsDto } from "../../../../models/communities/CommunityMemberDetailsDto";

import { CommunityJoinRequestCard } from "./CommunityJoinRequestCard";
import { CountBadge } from "../../../ui/CountBadge";

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
        <JoinRequestsEmptyState />
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

          <div className="mt-6">
            <Pagination
              page={page}
              total={total}
              pageSize={limit}
              onChange={setPage}
            />
          </div>
        </>
      )}
    </SectionCard>
  );
}

function JoinRequestsEmptyState() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 px-5 py-6">
      <p className="text-sm font-semibold text-white/55">
        No pending requests.
      </p>

      <p className="mt-1 text-sm leading-6 text-white/30">
        New join requests will appear here when users ask to enter this private
        community.
      </p>
    </div>
  );
}

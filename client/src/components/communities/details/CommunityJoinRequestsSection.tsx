import { Empty, Pagination, Spinner } from "../../ui/UI";
import type { CommunityMemberDetailsDto } from "../../../models/communities/CommunityMemberDetailsDto";
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
  return (
    <section className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Join requests
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/35">
          Review pending requests from users who want to join this private
          community.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={24} />
        </div>
      ) : requests.length === 0 ? (
        <div className="mt-5">
          <Empty message="No pending join requests." />
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
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
    </section>
  );
}

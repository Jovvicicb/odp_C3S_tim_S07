import {
  Empty,
  ErrorBox,
  PageHeader,
  Pagination,
  Spinner,
} from "../../components/ui/UI";

import { CommunityCard } from "../../components/community/CommunityCard";

import { useMyCommunities } from "../../hooks/community/useMyCommunities";
import { ActionButton } from "../../components/ui/ActionButton";

export default function MyCommunitiesPage() {
  const { communities, loading, error, page, limit, total, setPage } =
    useMyCommunities(1, 10);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Communities"
        title="My communities"
        action={
          <ActionButton
            variant="create"
            label="Create community"
            to="/communities/create"
          />
        }
      />

      {error && <ErrorBox message={error} />}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : communities.length === 0 ? (
        <Empty message="You haven't created any communities yet." />
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>

          <Pagination
            page={page}
            total={total}
            pageSize={limit}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}

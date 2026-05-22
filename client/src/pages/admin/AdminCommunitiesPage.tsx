import {
  Empty,
  ErrorBox,
  PageHeader,
  Pagination,
  Spinner,
} from "../../components/ui/UI";
import { CommunityCard } from "../../components/communities/CommunityCard";
import { useAdminCommunities } from "../../hooks/communities/useAdminCommunities";

export default function AdminCommunitiesPage() {
  const { communities, loading, error, page, limit, total, setPage } =
    useAdminCommunities(1, 10);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin panel" title="Communities" />

      {error && <ErrorBox message={error} />}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : communities.length === 0 && !error ? (
        <Empty message="No communities found" />
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

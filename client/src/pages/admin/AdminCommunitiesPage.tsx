import {
  Empty,
  ErrorBox,
  PageHeader,
  Pagination,
  Spinner,
} from "../../components/ui/UI";
import { CommunityCard } from "../../components/community/CommunityCard";
import { useAdminCommunities } from "../../hooks/community/useAdminCommunities";

export default function AdminCommunitiesPage() {
  const { communities, loading, error, page, limit, total, setPage } =
    useAdminCommunities(1, 10);

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Communities" />

      {error && <ErrorBox message={error} />}

      {loading ? (
        <div className="py-20 flex justify-center">
          <Spinner size={24} />
        </div>
      ) : communities.length === 0 && !error ? (
        <Empty message="No communities found" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
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

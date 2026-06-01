import { usePublicCommunities } from "../../hooks/communities/public/usePublicCommunities";

import { ErrorBox, Pagination, Spinner } from "../ui/UI";
import { SectionEmptyState } from "../ui/SectionEmptyState";
import { PublicCommunityPreviewCard } from "./PublicCommunityPreviewCard";
import { PublicCommunitiesHeader } from "./PublicCommunitiesHeader";

export function PublicCommunitiesSection() {
  const { communities, loading, error, page, limit, total, setPage } =
    usePublicCommunities(1, 6);

  return (
    <section id="public-communities" className="space-y-6 pb-12">
      <PublicCommunitiesHeader total={total} />

      {error && <ErrorBox message={error} />}

      {loading ? (
        <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 py-16 shadow-xl shadow-sky-950/10">
          <div className="flex justify-center">
            <Spinner size={24} />
          </div>
        </div>
      ) : communities.length === 0 ? (
        <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
          <SectionEmptyState
            title="No public communities yet."
            description="Public communities will appear here when they are created."
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {communities.map((community) => (
              <PublicCommunityPreviewCard
                key={community.id}
                community={community}
              />
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
    </section>
  );
}

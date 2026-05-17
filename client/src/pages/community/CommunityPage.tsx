import { ActionButton } from "../../components/ui/ActionButton";
import { CommunityCard } from "../../components/community/CommunityCard";
import {
  Empty,
  ErrorBox,
  PageHeader,
  Pagination,
  Spinner,
} from "../../components/ui/UI";
import { useCommunityMembership } from "../../hooks/community/useCommunityMembership";
import { useToast } from "../../hooks/toast/useToast";
import { useDiscoverCommunities } from "../../hooks/community/useDiscoverCommunities";
import type { CommunityDiscoverType } from "../../types/community/CommunityDiscoverType";

export default function CommunitiesPage() {
  const {
    communities,
    setCommunities,
    loading,
    error,
    page,
    limit,
    total,
    type,
    search,
    setPage,
    setType,
    setSearch,
  } = useDiscoverCommunities(1, 10);

  const { showToast } = useToast();

  const {
    joinCommunity,
    leaveCommunity,
    loadingCommunityId,
    error: membershipError,
  } = useCommunityMembership();

  const handleTypeChange = (value: CommunityDiscoverType) => {
    setType(value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleJoin = async (communityId: number) => {
    try {
      const message = await joinCommunity(communityId);

      if (!message) return;

      setCommunities((current) =>
        current.map((community) =>
          community.id === communityId
            ? {
                ...community,
                membershipStatus:
                  community.type === "public" ? "active" : "pending",
              }
            : community,
        ),
      );

      showToast({
        type: "success",
        message,
      });
    } catch {
      showToast({
        type: "error",
        message: "Failed to join community",
      });
    }
  };

  const handleLeave = async (communityId: number) => {
    try {
      const message = await leaveCommunity(communityId);

      if (!message) return;

      setCommunities((current) =>
        current.map((community) =>
          community.id === communityId
            ? {
                ...community,
                membershipStatus: null,
              }
            : community,
        ),
      );

      showToast({
        type: "success",
        message,
      });
    } catch {
      showToast({
        type: "error",
        message: "Failed to leave community",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Communities"
        title="Discover communities"
        action={
          <ActionButton
            variant="create"
            label="Create community"
            to="/communities/create"
            size="md"
          />
        }
      />

      <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-4 shadow-xl shadow-sky-950/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            id="community-search"
            name="community-search"
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search communities..."
            className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 md:max-w-md"
          />

          <div className="flex flex-wrap gap-2">
            {(["all", "public", "private"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleTypeChange(value)}
                className={`rounded-2xl border px-4 py-2 text-xs font-semibold capitalize transition-all ${
                  type === value
                    ? "border-sky-300/30 bg-sky-400/10 text-sky-100 shadow-lg shadow-sky-500/10"
                    : "border-white/10 bg-white/4 text-white/45 hover:border-white/20 hover:bg-white/6 hover:text-white/70"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      {(error || membershipError) && (
        <ErrorBox message={error || membershipError} />
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : communities.length === 0 && !error ? (
        <Empty message="No communities found." />
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {communities.map((community) => (
              <CommunityCard
                key={community.id}
                community={community}
                showMembershipAction
                actionLoading={loadingCommunityId === community.id}
                onJoin={handleJoin}
                onLeave={handleLeave}
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
    </div>
  );
}

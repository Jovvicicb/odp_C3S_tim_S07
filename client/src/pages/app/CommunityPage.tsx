import { ActionButton } from "../../components/ui/ActionButton";
import { CommunityCard } from "../../components/community/CommunityCard";
import {
  Empty,
  ErrorBox,
  PageHeader,
  Pagination,
  Spinner,
} from "../../components/ui/UI";
import { usePublicCommunities } from "../../hooks/community/usePublicCommunities";
import { useCommunityMembership } from "../../hooks/community/useCommunityMembership";
import { useToast } from "../../hooks/toast/useToast";

export default function CommunitiesPage() {
  const {
    communities,
    setCommunities,
    loading,
    error,
    page,
    limit,
    total,
    setPage,
  } = usePublicCommunities(1, 10);

  const { showToast } = useToast();

  const {
    joinCommunity,
    leaveCommunity,
    loadingCommunityId,
    error: membershipError,
  } = useCommunityMembership();

  const handleJoin = async (communityId: number) => {
    const message = await joinCommunity(communityId);

    if (!message) {
      return;
    }

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
  };

  const handleLeave = async (communityId: number) => {
    const message = await leaveCommunity(communityId);

    if (!message) {
      return;
    }

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
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Communities"
        title="Public communities"
        action={
          <ActionButton
            variant="create"
            label="Create community"
            to="/communities/create"
            size="md"
          />
        }
      />

      {(error || membershipError) && (
        <ErrorBox message={error || membershipError} />
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : communities.length === 0 && !error ? (
        <Empty message="No public communities found." />
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {communities.map((community) => (
              <CommunityCard
                key={community.id}
                community={community}
                showMembershipAction={true}
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

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
import { useCommunityMembership } from "../../hooks/community/useCommunityMembership";
import { useToast } from "../../hooks/toast/useToast";

export default function MyCommunitiesPage() {
  const {
    communities,
    setCommunities,
    loading,
    error,
    page,
    limit,
    total,
    setTotal,
    setPage,
  } = useMyCommunities(1, 10);

  const { showToast } = useToast();

  const {
    leaveCommunity,
    loadingCommunityId,
    error: membershipError,
  } = useCommunityMembership();

  const handleLeave = async (communityId: number) => {
    const message = await leaveCommunity(communityId);

    if (!message) {
      return;
    }

    setCommunities((current) =>
      current.filter((community) => community.id !== communityId),
    );

    setTotal((current) => Math.max(0, current - 1));

    showToast({
      type: "success",
      message,
    });

    if (communities.length === 1 && page > 1) {
      setPage(page - 1);
    }
  };

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

      {(error || membershipError) && (
        <ErrorBox message={error || membershipError} />
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : communities.length === 0 ? (
        <Empty message="You haven't joined any communities yet." />
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {communities.map((community) => (
              <CommunityCard
                key={community.id}
                community={{
                  ...community,
                  membershipStatus: "active",
                }}
                showMembershipAction
                actionLoading={loadingCommunityId === community.id}
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

import {
  Empty,
  ErrorBox,
  PageHeader,
  Pagination,
  Spinner,
} from "../../components/ui/UI";
import { ActionButton } from "../../components/ui/ActionButton";

import { MyCommunitiesList } from "../../components/communities/my/MyCommunitiesList";

import { useMyCommunities } from "../../hooks/communities/useMyCommunities";
import { useMyCommunitiesActions } from "../../hooks/communities/my/useMyCommunitiesActions";

import { useAuth } from "../../hooks/auth/useAuthHook";
import { IntroPanel } from "../../components/ui/IntroPanel";

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

  const { handleLeave, loadingCommunityId, membershipError } =
    useMyCommunitiesActions({
      communities,
      page,
      setPage,
      setTotal,
      setCommunities,
    });

  const { user } = useAuth();

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

      <IntroPanel
        label="Your communities"
        title="Communities you follow"
        description="Quickly access communities where you can read posts, join discussions and keep up with members."
        highlight={`${total} ${total === 1 ? "community" : "communities"} in your list.`}
      />

      {(error || membershipError) && (
        <ErrorBox message={error || membershipError} />
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : communities.length === 0 && !error ? (
        <Empty message="You are not a member of communities yet." />
      ) : (
        <>
          <MyCommunitiesList
            communities={communities}
            currentUserId={user?.id ?? null}
            loadingCommunityId={loadingCommunityId}
            onLeave={handleLeave}
          />

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

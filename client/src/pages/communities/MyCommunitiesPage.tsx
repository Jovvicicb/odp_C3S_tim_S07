import { SectionEmptyState } from "../../components/ui/empty/SectionEmptyState";
import { ActionButton } from "../../components/ui/button/ActionButton";
import { IntroPanel } from "../../components/ui/panel/IntroPanel";
import { PageHeader } from "../../components/ui/layout/PageHeader";
import { ErrorBox } from "../../components/ui/feedback/ErrorBox";
import { Pagination } from "../../components/ui/pagination/Pagination";
import { Spinner } from "../../components/ui/spinner/Spinner";

import { MyCommunitiesList } from "../../components/communities/my/MyCommunitiesList";

import { useMyCommunities } from "../../hooks/communities/my/useMyCommunities";
import { useMyCommunitiesActions } from "../../hooks/communities/my/useMyCommunitiesActions";

import { useAuth } from "../../hooks/auth/useAuthHook";

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
        <SectionEmptyState
          title="You have not joined communities yet."
          description="Discover communities, join the ones you like and they will appear here."
        />
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

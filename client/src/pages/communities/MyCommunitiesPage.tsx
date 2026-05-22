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
      ) : communities.length === 0 && !error ? (
        <Empty message="You haven't joined any communities yet." />
      ) : (
        <>
          <MyCommunitiesList
            communities={communities}
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

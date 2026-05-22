import { ActionButton } from "../../components/ui/ActionButton";
import {
  Empty,
  ErrorBox,
  PageHeader,
  Pagination,
  Spinner,
} from "../../components/ui/UI";

import { DiscoverCommunitiesToolbar } from "../../components/communities/discover/DiscoverCommunitiesToolbar";
import { DiscoverCommunitiesList } from "../../components/communities/discover/DiscoverCommunitiesList";

import { useDiscoverCommunities } from "../../hooks/communities/useDiscoverCommunities";
import { useDiscoverCommunityActions } from "../../hooks/communities/discover/useDiscoverCommunityActions";

import type { CommunityDiscoverType } from "../../types/communities/CommunityDiscoverType";

export default function DiscoverCommunitiesPage() {
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

  const { handleJoin, handleLeave, loadingCommunityId, membershipError } =
    useDiscoverCommunityActions({
      setCommunities,
    });

  const handleTypeChange = (value: CommunityDiscoverType) => {
    setType(value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
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

      <DiscoverCommunitiesToolbar
        search={search}
        type={type}
        onSearchChange={handleSearchChange}
        onTypeChange={handleTypeChange}
      />

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
          <DiscoverCommunitiesList
            communities={communities}
            loadingCommunityId={loadingCommunityId}
            onJoin={handleJoin}
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

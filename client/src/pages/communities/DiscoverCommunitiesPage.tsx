import { ActionButton } from "../../components/ui/button/ActionButton";
import { ErrorBox } from "../../components/ui/feedback/ErrorBox";
import { PageHeader } from "../../components/ui/layout/PageHeader";
import { Pagination } from "../../components/ui/pagination/Pagination";
import { Spinner } from "../../components/ui/spinner/Spinner";
import { SectionEmptyState } from "../../components/ui/empty/SectionEmptyState";

import { DiscoverCommunitiesToolbar } from "../../components/communities/discover/DiscoverCommunitiesToolbar";
import { DiscoverCommunitiesList } from "../../components/communities/discover/DiscoverCommunitiesList";

import { useDiscoverCommunities } from "../../hooks/communities/discover/useDiscoverCommunities";
import { useDiscoverCommunityActions } from "../../hooks/communities/discover/useDiscoverCommunityActions";

import type { CommunityDiscoverType } from "../../types/communities/common/CommunityDiscoverType";

import { useAuth } from "../../hooks/auth/useAuthHook";

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

  const { user } = useAuth();

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
        total={total}
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
        <SectionEmptyState
          title="No communities found."
          description={
            search.trim()
              ? "Try changing your search term or clearing the current filter."
              : "Communities will appear here when users create them."
          }
        />
      ) : (
        <>
          <DiscoverCommunitiesList
            communities={communities}
            currentUserId={user?.id ?? null}
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

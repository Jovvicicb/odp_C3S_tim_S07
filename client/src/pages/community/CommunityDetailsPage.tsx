import { useState } from "react";
import { useParams } from "react-router-dom";

import { Empty, ErrorBox, PageHeader, Spinner } from "../../components/ui/UI";
import { ActionButton } from "../../components/ui/ActionButton";
import { CommunityCard } from "../../components/community/CommunityCard";

import { CommunityDetailsTabs } from "../../components/community/details/CommunityDetailsTabs";
import { CommunityLockedPanel } from "../../components/community/details/CommunityLockedPanel";
import { CommunityMembersSection } from "../../components/community/details/CommunityMembersSection";
import { CommunityPostsSection } from "../../components/community/details/CommunityPostsSection";

import { useCommunityDetails } from "../../hooks/community/useCommunityDetails";
import { useCommunityPosts } from "../../hooks/posts/useCommunityPosts";
import { useCommunityDetailsActions } from "../../hooks/community/details/useCommunityDetailsActions";

type CommunityDetailsTab = "posts" | "members";

export default function CommunityDetailsPage() {
  const { id } = useParams();

  const communityId = Number(id);

  const [activeTab, setActiveTab] = useState<CommunityDetailsTab>("posts");

  const { details, setDetails, loading, error, reload } = useCommunityDetails(
    Number.isNaN(communityId) ? null : communityId,
    1,
    10,
  );

  const {
    handleJoin,
    handleLeave,
    handleFollow,
    handleUnfollow,
    loadingCommunityId,
    loadingUserId,
    membershipError,
    followError,
  } = useCommunityDetailsActions({
    setDetails,
    reload,
  });

  const {
    posts,
    loading: postsLoading,
    error: postsError,
    page: postsPage,
    limit: postsLimit,
    total: postsTotal,
    sort: postsSort,
    setPage: setPostsPage,
    setSort: setPostsSort,
  } = useCommunityPosts(
    Number.isNaN(communityId) ? null : communityId,
    details?.canViewContent === true,
    1,
    10,
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={24} />
      </div>
    );
  }

  if (!details) {
    return <Empty message="Community not found." />;
  }

  const { community, members, canViewContent } = details;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Community Details"
        title={community.name}
        action={<ActionButton variant="back" label="Back" />}
      />

      {(error || membershipError || followError || postsError) && (
        <ErrorBox
          message={error || membershipError || followError || postsError}
        />
      )}

      <CommunityCard
        community={community}
        showMembershipAction
        actionLoading={loadingCommunityId === community.id}
        onJoin={handleJoin}
        onLeave={handleLeave}
      />

      {!canViewContent ? (
        <CommunityLockedPanel community={community} />
      ) : (
        <>
          <CommunityDetailsTabs activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === "posts" && (
            <CommunityPostsSection
              community={community}
              posts={posts}
              postsLoading={postsLoading}
              postsError={postsError}
              postsPage={postsPage}
              postsLimit={postsLimit}
              postsTotal={postsTotal}
              postsSort={postsSort}
              setPostsPage={setPostsPage}
              setPostsSort={setPostsSort}
            />
          )}

          {activeTab === "members" && (
            <CommunityMembersSection
              members={members}
              loadingUserId={loadingUserId}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
            />
          )}
        </>
      )}
    </div>
  );
}

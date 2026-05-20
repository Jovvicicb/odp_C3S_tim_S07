import { useState } from "react";
import { useParams } from "react-router-dom";

import { Empty, ErrorBox, PageHeader, Spinner } from "../../components/ui/UI";
import { ActionButton } from "../../components/ui/ActionButton";
import { CommunityCard } from "../../components/community/CommunityCard";

import { CommunityDetailsTabs } from "../../components/community/details/CommunityDetailsTabs";
import { CommunityLockedPanel } from "../../components/community/details/CommunityLockedPanel";
import { CommunityMembersSection } from "../../components/community/details/CommunityMembersSection";
import { CommunityPostsSection } from "../../components/community/details/CommunityPostsSection";
import { CommunityJoinRequestsSection } from "../../components/community/details/CommunityJoinRequestsSection";

import { useAuth } from "../../hooks/auth/useAuthHook";
import { useCommunityDetails } from "../../hooks/community/details/useCommunityDetails";
import { useCommunityPosts } from "../../hooks/posts/useCommunityPosts";
import { useCommunityDetailsActions } from "../../hooks/community/details/useCommunityDetailsActions";
import { useCommunityMemberModerationActions } from "../../hooks/community/details/useCommunityMemberModerationActions";
import { useCommunityJoinRequests } from "../../hooks/community/details/useCommunityJoinRequests";
import { useCommunityJoinRequestActions } from "../../hooks/community/details/useCommunityJoinRequestActions";

import type { CommunityDetailsTab } from "../../types/community/CommunityDetailsTab";

export default function CommunityDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const communityId = Number(id);
  const parsedCommunityId = Number.isNaN(communityId) ? null : communityId;

  const [activeTab, setActiveTab] = useState<CommunityDetailsTab>("posts");

  const { details, setDetails, loading, error, reload } = useCommunityDetails(
    parsedCommunityId,
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
    handleCommunityRoleChange,
    handleRemoveCommunityMember,
    loadingMemberActionUserId,
    communityMemberError,
  } = useCommunityMemberModerationActions({
    setDetails,
    reloadDetails: reload,
  });

  const canProcessJoinRequests =
    details?.permissions.canProcessJoinRequests === true;

  const {
    requests,
    setRequests,
    loading: requestsLoading,
    error: requestsError,
    page: requestsPage,
    limit: requestsLimit,
    total: requestsTotal,
    setPage: setRequestsPage,
    setTotal: setRequestsTotal,
    reload: reloadJoinRequests,
  } = useCommunityJoinRequests(
    parsedCommunityId,
    canProcessJoinRequests,
    1,
    10,
  );

  const {
    handleJoinRequestStatus,
    loadingJoinRequestUserId,
    joinRequestActionError,
  } = useCommunityJoinRequestActions({
    setRequests,
    setTotal: setRequestsTotal,
    reloadDetails: reload,
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
    reload: reloadPosts,
  } = useCommunityPosts(
    parsedCommunityId,
    details?.canViewContent === true,
    1,
    10,
  );

  const visibleActiveTab: CommunityDetailsTab =
    activeTab === "requests" && !canProcessJoinRequests ? "posts" : activeTab;

  const handleTabChange = (tab: CommunityDetailsTab) => {
    setActiveTab(tab);

    if (tab === "posts" && details?.canViewContent) {
      void reloadPosts();
      return;
    }

    if (tab === "members") {
      void reload();
      return;
    }

    if (tab === "requests" && canProcessJoinRequests) {
      void reloadJoinRequests();
    }
  };

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

  const { community, members, canViewContent, permissions } = details;

  const pageError =
    error ||
    membershipError ||
    followError ||
    postsError ||
    communityMemberError ||
    requestsError ||
    joinRequestActionError;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Community Details"
        title={community.name}
        action={<ActionButton variant="back" label="Back" />}
      />

      {pageError && <ErrorBox message={pageError} />}

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
          <CommunityDetailsTabs
            activeTab={visibleActiveTab}
            onChange={handleTabChange}
            showRequestsTab={canProcessJoinRequests}
          />

          {visibleActiveTab === "posts" && (
            <CommunityPostsSection
              community={community}
              permissions={permissions}
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

          {visibleActiveTab === "members" && (
            <CommunityMembersSection
              communityId={community.id}
              members={members}
              permissions={permissions}
              currentUserId={user?.id}
              loadingUserId={loadingUserId}
              loadingMemberActionUserId={loadingMemberActionUserId}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
              onCommunityRoleChange={handleCommunityRoleChange}
              onRemoveCommunityMember={handleRemoveCommunityMember}
            />
          )}

          {visibleActiveTab === "requests" && canProcessJoinRequests && (
            <CommunityJoinRequestsSection
              requests={requests}
              loading={requestsLoading}
              page={requestsPage}
              limit={requestsLimit}
              total={requestsTotal}
              loadingUserId={loadingJoinRequestUserId}
              setPage={setRequestsPage}
              onAccept={(userId) =>
                handleJoinRequestStatus(community.id, userId, "accept")
              }
              onDeny={(userId) =>
                handleJoinRequestStatus(community.id, userId, "deny")
              }
            />
          )}
        </>
      )}
    </div>
  );
}

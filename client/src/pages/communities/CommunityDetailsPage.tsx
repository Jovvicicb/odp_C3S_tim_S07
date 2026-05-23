import { useState } from "react";
import { useParams } from "react-router-dom";

import { Empty, ErrorBox, PageHeader, Spinner } from "../../components/ui/UI";
import { ActionButton } from "../../components/ui/ActionButton";

import { CommunityDetailsTabs } from "../../components/communities/details/navigation/CommunityDetailsTabs";

import { CommunityPostsSection } from "../../components/communities/details/posts/CommunityPostsSection";
import { CommunityJoinRequestsSection } from "../../components/communities/details/requests/CommunityJoinRequestsSection";

import { useAuth } from "../../hooks/auth/useAuthHook";
import { useCommunityDetails } from "../../hooks/communities/details/useCommunityDetails";
import { useCommunityPosts } from "../../hooks/posts/useCommunityPosts";
import { useCommunityDetailsActions } from "../../hooks/communities/details/useCommunityDetailsActions";
import { useCommunityMemberModerationActions } from "../../hooks/communities/details/useCommunityMemberModerationActions";
import { useCommunityJoinRequests } from "../../hooks/communities/details/useCommunityJoinRequests";
import { useCommunityJoinRequestActions } from "../../hooks/communities/details/useCommunityJoinRequestActions";

import type { CommunityDetailsTab } from "../../types/communities/CommunityDetailsTab";
import { CommunityDetailsHero } from "../../components/communities/details/hero/CommunityDetailsHero";
import { CommunityLockedPanel } from "../../components/communities/details/locked/CommunityLockedPanel";
import { CommunityMembersSection } from "../../components/communities/details/members/CommunityMembersSection";
import { useDeleteCommunity } from "../../hooks/communities/details/useDeleteCommunity";

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

  const {
    handleDeleteCommunity,
    loadingCommunityDelete,
    communityDeleteError,
  } = useDeleteCommunity();

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
    joinRequestActionError ||
    communityDeleteError;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Community Details"
        title={community.name}
        action={<ActionButton variant="back" label="Back" />}
      />

      {pageError && <ErrorBox message={pageError} />}

      <CommunityDetailsHero
        community={community}
        permissions={permissions}
        membershipLoading={loadingCommunityId === community.id}
        deleteLoading={loadingCommunityDelete}
        onJoin={handleJoin}
        onLeave={handleLeave}
        onDelete={handleDeleteCommunity}
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

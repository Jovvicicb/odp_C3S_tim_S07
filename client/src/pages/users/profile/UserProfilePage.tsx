import { useState } from "react";
import { useParams } from "react-router-dom";

import { ErrorBox, PageHeader, Spinner } from "../../../components/ui/UI";
import { SectionEmptyState } from "../../../components/ui/SectionEmptyState";
import { ActionButton } from "../../../components/ui/button/ActionButton";
import { UserProfileHero } from "../../../components/users/profile/UserProfileHero";
import { UserProfilePostsSection } from "../../../components/users/profile/UserProfilePostsSection";
import { UserActiveTagsPanel } from "../../../components/users/profile/UserActiveTagsPanel";
import { UserProfileCommentsSection } from "../../../components/users/profile/UserProfileCommentsSection";
import { UserProfileTabs } from "../../../components/users/profile/navigation/UserProfileTabs";

import { useAuth } from "../../../hooks/auth/useAuthHook";
import { useUserProfile } from "../../../hooks/users/core/useUserProfile";
import { useUserProfileFollowActions } from "../../../hooks/users/profile/useUserProfileFollowActions";
import { useUserPosts } from "../../../hooks/posts/user/useUserPosts";
import { useUserComments } from "../../../hooks/comments/user/useUserComments";

import type { UserProfileTab } from "../../../types/users/profile/UserProfileTab";

export default function UserProfilePage() {
  const { id } = useParams();

  const profileId = Number(id);
  const parsedProfileId = Number.isNaN(profileId) ? undefined : profileId;

  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

  const [activeTab, setActiveTab] = useState<UserProfileTab>("posts");

  const { profile, setProfile, loading, error } =
    useUserProfile(parsedProfileId);

  const { handleFollow, handleUnfollow, loadingUserId, followError } =
    useUserProfileFollowActions({
      setProfile,
    });

  const postsEnabled = activeTab === "posts";
  const commentsEnabled = activeTab === "comments";

  const {
    posts,
    loading: postsLoading,
    error: postsError,
    reload: reloadPosts,
  } = useUserPosts(profile?.id, postsEnabled);

  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    page: commentsPage,
    limit: commentsLimit,
    total: commentsTotal,
    setPage: setCommentsPage,
    reload: reloadComments,
  } = useUserComments(profile?.id, commentsEnabled, 1, 10);

  const isOwnProfile = user?.id === profile?.id;

  const pageError = error || followError || postsError || commentsError;

  const handleTabChange = (tab: UserProfileTab) => {
    setActiveTab(tab);

    if (tab === "posts") {
      void reloadPosts();
      return;
    }

    if (tab === "comments") {
      void reloadComments();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={24} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Users"
          title="Profile not found"
          action={<ActionButton variant="back" label="Back" />}
        />

        <SectionEmptyState
          title="User profile not found."
          description="The profile you are trying to open does not exist or is no longer available."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Users"
        title={isOwnProfile ? "My profile" : `${profile.username}'s profile`}
        action={<ActionButton variant="back" label="Back" />}
      />

      {pageError && <ErrorBox message={pageError} />}

      <UserProfileHero
        profile={profile}
        isOwnProfile={isOwnProfile}
        isAuthenticated={isAuthenticated}
        followLoading={loadingUserId === profile.id}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
      />

      <UserProfileTabs activeTab={activeTab} onChange={handleTabChange} />

      {activeTab === "posts" && (
        <>
          <UserActiveTagsPanel
            posts={posts}
            loading={postsLoading}
            isOwnProfile={isOwnProfile}
          />

          <UserProfilePostsSection
            posts={posts}
            loading={postsLoading}
            isOwnProfile={isOwnProfile}
          />
        </>
      )}

      {activeTab === "comments" && (
        <UserProfileCommentsSection
          comments={comments}
          loading={commentsLoading}
          isOwnProfile={isOwnProfile}
          page={commentsPage}
          limit={commentsLimit}
          total={commentsTotal}
          onPageChange={setCommentsPage}
        />
      )}
    </div>
  );
}

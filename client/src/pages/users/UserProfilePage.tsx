import { useParams } from "react-router-dom";

import { Empty, ErrorBox, PageHeader, Spinner } from "../../components/ui/UI";
import { ActionButton } from "../../components/ui/button/ActionButton";
import { UserProfileHero } from "../../components/users/profile/UserProfileHero";

import { useAuth } from "../../hooks/auth/useAuthHook";
import { useUserProfile } from "../../hooks/users/useUserProfile";
import { useUserProfileFollowActions } from "../../hooks/users/profile/useUserProfileFollowActions";

export default function UserProfilePage() {
  const { id } = useParams();

  const profileId = Number(id);
  const parsedProfileId = Number.isNaN(profileId) ? undefined : profileId;

  const { user } = useAuth();

  const { profile, setProfile, loading, error } =
    useUserProfile(parsedProfileId);

  const { handleFollow, handleUnfollow, loadingUserId, followError } =
    useUserProfileFollowActions({
      setProfile,
    });

  const isOwnProfile = user?.id === profile?.id;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={24} />
      </div>
    );
  }

  if (!profile) {
    return <Empty message="User profile not found." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Users"
        title={isOwnProfile ? "My profile" : `${profile.username}'s profile`}
        action={<ActionButton variant="back" label="Back" />}
      />

      {(error || followError) && <ErrorBox message={error || followError} />}

      <UserProfileHero
        profile={profile}
        isOwnProfile={isOwnProfile}
        followLoading={loadingUserId === profile.id}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
      />
    </div>
  );
}

import { useParams } from "react-router-dom";

import EditProfileForm from "../../../components/users/profile/edit/EditProfileForm";

import { SectionEmptyState } from "../../../components/ui/empty/SectionEmptyState";
import { ErrorBox } from "../../../components/ui/feedback/ErrorBox";
import { PageHeader } from "../../../components/ui/layout/PageHeader";
import { Spinner } from "../../../components/ui/spinner/Spinner";

import { ActionButton } from "../../../components/ui/button/ActionButton";
import { IntroPanel } from "../../../components/ui/panel/IntroPanel";

import { useAuth } from "../../../hooks/auth/useAuthHook";
import { useUserProfile } from "../../../hooks/users/core/useUserProfile";

export default function EditUserProfilePage() {
  const { id } = useParams();

  const profileId = Number(id);
  const parsedProfileId = Number.isNaN(profileId) ? undefined : profileId;

  const { user } = useAuth();

  const isOwnProfile = user?.id === parsedProfileId;

  const { profile, loading, error, reload } = useUserProfile(parsedProfileId);

  if (!isOwnProfile) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Profile"
          title="Edit profile"
          action={<ActionButton variant="back" label="Back" />}
        />

        <SectionEmptyState
          title="Permission denied."
          description="You can edit only your own profile."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My profile"
        title="Edit profile"
        action={<ActionButton variant="back" label="Back" />}
      />

      <IntroPanel
        label="Profile settings"
        title="Manage your profile information"
        description="Keep your profile up to date with the name, photo and bio you want other people to see."
      />
      {error && <ErrorBox message={error} />}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : !profile ? (
        <SectionEmptyState
          title="Profile not found."
          description="The profile you are trying to edit does not exist or is no longer available."
        />
      ) : (
        <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
          <EditProfileForm profile={profile} onUpdated={reload} />
        </div>
      )}
    </div>
  );
}

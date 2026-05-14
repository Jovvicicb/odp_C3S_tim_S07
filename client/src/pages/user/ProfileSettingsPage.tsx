import EditProfileForm from "../../components/user/EditProfileForm";
import { Empty, ErrorBox, PageHeader, Spinner } from "../../components/ui/UI";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { useUserProfile } from "../../hooks/users/useUserProfile";

export default function ProfileSettingsPage() {
  const { user } = useAuth();

  const { profile, loading, error, reload } = useUserProfile(user?.id);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="My profile" title="Profile settings" />

      {error && <ErrorBox message={error} />}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : !profile ? (
        <Empty message="Profile not found" />
      ) : (
        <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
          <EditProfileForm profile={profile} onUpdated={reload} />
        </div>
      )}
    </div>
  );
}

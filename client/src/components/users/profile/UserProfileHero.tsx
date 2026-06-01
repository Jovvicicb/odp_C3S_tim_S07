import { useNavigate } from "react-router-dom";

import type { UserDto } from "../../../models/users/UserDto";
import type { UserFollowStatus } from "../../../types/users/UserFollowStatus";

import { ActionButton } from "../../ui/button/ActionButton";
import { Badge } from "../../ui/Badge";
import { RoleBadge } from "../../ui/RoleBadge";
import { SectionLabel } from "../../ui/SectionLabel";

import { UserAvatar } from "../shared/UserAvatar";
import { UserFollowButton } from "../shared/UserFollowButton";
import { UserProfileNetworkStats } from "./UserProfileNetworkStats";

type Props = {
  profile: UserDto;
  isOwnProfile: boolean;
  isAuthenticated: boolean;
  followLoading: boolean;
  onFollow: (userId: number) => void;
  onUnfollow: (userId: number) => void;
};

export function UserProfileHero({
  profile,
  isOwnProfile,
  isAuthenticated,
  followLoading,
  onFollow,
  onUnfollow,
}: Props) {
  const navigate = useNavigate();

  const createdAt = new Date(profile.createdAt).toLocaleDateString();

  const followStatus: UserFollowStatus = isOwnProfile
    ? "self"
    : profile.followStatus === "following"
      ? "following"
      : "not_following";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-sky-400/5 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-sky-500/3 blur-3xl" />

      <div className="relative z-10 border-b border-white/8 bg-white/2 px-6 py-5">
        <SectionLabel label="Profile overview" tone="sky" />

        <h2 className="mt-2 text-xl font-bold tracking-tight text-white">
          User profile
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
          View profile information, follow this user and explore their activity
          across PulseNet.
        </p>
      </div>

      <div className="relative z-10 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-5 sm:flex-row sm:items-start">
            <UserAvatar
              username={profile.username}
              image={profile.image}
              size="xl"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="wrap-break-word text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {profile.username}
                </h2>

                <RoleBadge role={profile.role} />

                {isOwnProfile && <Badge tone="emerald">You</Badge>}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/35">
                <span>Joined {createdAt}</span>

                {isOwnProfile && (
                  <>
                    <span className="text-white/15">•</span>

                    <span>{profile.email}</span>
                  </>
                )}

                <span className="text-white/15">•</span>

                <span>User #{profile.id}</span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 lg:items-end">
            <UserProfileNetworkStats
              userId={profile.id}
              followersCount={profile.followersCount}
              followingCount={profile.followingCount}
              isOwnProfile={isOwnProfile}
              isAuthenticated={isAuthenticated}
            />

            {isAuthenticated && (
              <div className="flex flex-wrap items-center justify-end gap-3">
                {isOwnProfile ? (
                  <ActionButton
                    variant="create"
                    label="Edit profile"
                    icon="✎"
                    onClick={() => navigate(`/users/${profile.id}/edit`)}
                  />
                ) : (
                  <UserFollowButton
                    userId={profile.id}
                    followStatus={followStatus}
                    loading={followLoading}
                    onFollow={onFollow}
                    onUnfollow={onUnfollow}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-sky-300/10 bg-sky-400/4 px-5 py-4">
            <SectionLabel label="Full name" tone="sky" />

            <p className="text-sm leading-7 text-white/65">
              {profile.fullname || "No full name provided."}
            </p>
          </div>

          <div className="border-l border-amber-300/20 pl-4">
            <SectionLabel label="Bio" tone="amber" />

            <p className="whitespace-pre-wrap text-sm leading-7 text-white/45">
              {profile.bio || "This user has not added a bio yet."}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/6 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              tone={profile.isActive ? "emerald" : "muted"}
              className="rounded-2xl px-3 py-1.5"
            >
              {profile.isActive ? "Active account" : "Inactive account"}
            </Badge>

            {isAuthenticated &&
              !isOwnProfile &&
              followStatus === "following" && (
                <Badge tone="sky" className="rounded-2xl px-3 py-1.5">
                  Following
                </Badge>
              )}
          </div>

          <span className="text-xs font-semibold text-white/30">
            Profile overview
          </span>
        </div>
      </div>
    </section>
  );
}

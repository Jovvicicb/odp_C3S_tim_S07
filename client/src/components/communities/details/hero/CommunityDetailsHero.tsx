import type { CommunityDto } from "../../../../models/communities/CommunityDto";
import type { CommunityViewerPermissionsDto } from "../../../../models/communities/CommunityViewerPermissionsDto";

import { ImageHelper } from "../../../../helpers/images/ImageHelper";
import { SectionLabel } from "../../../ui/SectionLabel";

import { CommunityAvatar } from "../../card/CommunityAvatar";
import { CommunityTypeBadge } from "../../card/CommunityTypeBadge";
import { CommunityMembershipBadge } from "../../card/CommunityMembershipBadge";
import { CommunityHeroActions } from "./CommunityHeroActions";

type Props = {
  community: CommunityDto;
  permissions: CommunityViewerPermissionsDto;
  membershipLoading?: boolean;
  deleteLoading?: boolean;
  onJoin: (communityId: number) => void;
  onLeave: (communityId: number) => void;
  onDelete: (communityId: number) => void;
};
export function CommunityDetailsHero({
  community,
  permissions,
  membershipLoading = false,
  deleteLoading = false,
  onJoin,
  onLeave,
  onDelete,
}: Props) {
  const createdAt = new Date(community.createdAt).toLocaleDateString();
  const imageUrl = ImageHelper.getImageUrl(community.avatar);
  const initial = community.name[0]?.toUpperCase() ?? "#";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-sky-400/5 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-sky-500/3 blur-3xl" />

      <div className="relative z-10 border-b border-white/8 bg-white/2 px-6 py-5">
        <SectionLabel label="Community overview" tone="sky" />

        <h2 className="mt-2 text-xl font-bold tracking-tight text-white">
          Community profile
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
          See what this community is about, check its rules and manage your
          membership from one place.
        </p>
      </div>

      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-sky-400/5 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-sky-500/3 blur-3xl" />

      <div className="relative z-10 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-1 gap-5">
            <CommunityAvatar
              name={community.name}
              imageUrl={imageUrl}
              initial={initial}
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {community.name}
                </h2>

                <CommunityTypeBadge type={community.type} />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/35">
                <span>
                  Created by{" "}
                  <span className="font-semibold text-sky-100/65">
                    {community.ownerUsername ?? "Unavailable user"}
                  </span>
                </span>

                <span className="text-white/15">•</span>

                <span>{createdAt}</span>

                <span className="text-white/15">•</span>

                <span>Community #{community.id}</span>
              </div>
            </div>
          </div>

          <CommunityHeroActions
            community={community}
            permissions={permissions}
            membershipLoading={membershipLoading}
            deleteLoading={deleteLoading}
            onJoin={onJoin}
            onLeave={onLeave}
            onDelete={onDelete}
          />
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-sky-300/10 bg-sky-400/[0.04] px-5 py-4">
            <SectionLabel label="Description" tone="sky" />

            <p className="whitespace-pre-wrap text-sm leading-7 text-white/65">
              {community.description || "No description provided."}
            </p>
          </div>

          <div className="border-l border-amber-300/20 pl-4">
            <SectionLabel label="Rules" tone="amber" />

            <p className="whitespace-pre-wrap text-sm leading-7 text-white/42">
              {community.rules || "No rules defined."}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/6 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <CommunityMembershipBadge
              status={community.membershipStatus}
              isOwner={permissions.isOwner}
            />

            {permissions.isModerator && (
              <span className="rounded-xl border border-amber-300/15 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-200/70">
                Moderator access
              </span>
            )}

            {permissions.canCreatePost && (
              <span className="rounded-xl border border-sky-300/10 bg-sky-400/5 px-3 py-1.5 text-xs font-semibold text-sky-100/55">
                Can create posts
              </span>
            )}
          </div>

          <span className="text-xs font-semibold text-white/30">
            Community overview
          </span>
        </div>
      </div>
    </section>
  );
}

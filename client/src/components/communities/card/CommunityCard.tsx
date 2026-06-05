import { useNavigate } from "react-router-dom";

import type { CommunityDto } from "../../../models/communities/CommunityDto";
import { ImageHelper } from "../../../helpers/images/ImageHelper";
import { SectionLabel } from "../../ui/label/SectionLabel";

import { CommunityMembershipButton } from "../shared/CommunityMembershipButton";
import { CommunityAvatar } from "./CommunityAvatar";
import { CommunityTypeBadge } from "./CommunityTypeBadge";
import { CommunityMembershipBadge } from "./CommunityMembershipBadge";
import { Button } from "../../ui/button/Button";

type Props = {
  community: CommunityDto;
  currentUserId?: number | null;
  isOwnerOverride?: boolean;
  membershipStatusOverride?: CommunityDto["membershipStatus"];
  showMembershipAction?: boolean;
  actionLoading?: boolean;
  onJoin?: (communityId: number) => void;
  onLeave?: (communityId: number) => void;
  showDeleteAction?: boolean;
  deleteLoading?: boolean;
  onDelete?: (communityId: number) => void;
};

export function CommunityCard({
  community,
  currentUserId = null,
  isOwnerOverride,
  membershipStatusOverride,
  actionLoading = false,
  showMembershipAction = false,
  onJoin,
  onLeave,
  showDeleteAction = false,
  deleteLoading = false,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  const createdAt = new Date(community.createdAt).toLocaleDateString();
  const imageUrl = ImageHelper.getImageUrl(community.avatar);
  const initial = community.name[0]?.toUpperCase() ?? "#";

  const calculatedIsOwner =
    currentUserId !== null && community.ownerId === currentUserId;

  const isOwner = isOwnerOverride ?? calculatedIsOwner;

  const effectiveMembershipStatus =
    membershipStatusOverride ?? community.membershipStatus;

  const displayCommunity = {
    ...community,
    membershipStatus: effectiveMembershipStatus,
  };

  const showActionButton = showMembershipAction && !isOwner;

  return (
    <article
      onClick={() => navigate(`/communities/${community.id}`)}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10 transition-all hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-[#0e1520]/90"
    >
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-sky-400/5 blur-3xl transition-all group-hover:bg-sky-400/10" />

      <div className="relative z-10 p-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 flex-1 gap-4">
            <CommunityAvatar
              name={community.name}
              imageUrl={imageUrl}
              initial={initial}
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="line-clamp-1 text-lg font-bold tracking-tight text-white transition-colors group-hover:text-sky-100">
                  {community.name}
                </h2>

                <CommunityTypeBadge type={community.type} />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/35">
                <span>
                  By{" "}
                  <span className="font-semibold text-sky-100/65">
                    {community.ownerUsername ?? "Unavailable user"}
                  </span>
                </span>

                <span className="text-white/15">•</span>

                <span>Created {createdAt}</span>

                <span className="text-white/15">•</span>

                <span>Community #{community.id}</span>
              </div>

              <div className="mt-4">
                <SectionLabel label="Description" tone="sky" />

                <p className="line-clamp-2 text-sm leading-7 text-white/55">
                  {community.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-3">
            <span className="text-xs font-bold text-sky-200/60 transition-colors group-hover:text-sky-200">
              Open community →
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/6 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <CommunityMembershipBadge
              status={effectiveMembershipStatus}
              isOwner={isOwner}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {showActionButton && (
              <div onClick={(e) => e.stopPropagation()}>
                <CommunityMembershipButton
                  community={displayCommunity}
                  loading={actionLoading}
                  onJoin={onJoin}
                  onLeave={onLeave}
                />
              </div>
            )}

            {showDeleteAction && (
              <div onClick={(e) => e.stopPropagation()}>
                <Button
                  label="Delete"
                  loadingLabel="Deleting..."
                  loading={deleteLoading}
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete?.(community.id)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

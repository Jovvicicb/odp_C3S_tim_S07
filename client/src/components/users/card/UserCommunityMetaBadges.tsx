import type { CommunityMemberRole } from "../../../types/communities/members/CommunityMemberRole";

type Props = {
  communityRole?: CommunityMemberRole;
  isCommunityOwner?: boolean;
  isCurrentUser?: boolean;
};

export function UserCommunityMetaBadges({
  communityRole,
  isCommunityOwner = false,
  isCurrentUser = false,
}: Props) {
  const communityRoleLabel =
    communityRole === "moderator" ? "Moderator" : "Member";

  return (
    <>
      {isCommunityOwner && (
        <span className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
          Owner
        </span>
      )}

      {communityRole && (
        <span
          className={`rounded-xl border px-2.5 py-1 text-[11px] font-semibold ${
            communityRole === "moderator"
              ? "border-sky-300/20 bg-sky-400/10 text-sky-100"
              : "border-white/10 bg-white/5 text-white/45"
          }`}
        >
          {communityRoleLabel}
        </span>
      )}

      {isCurrentUser && (
        <span className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
          You
        </span>
      )}
    </>
  );
}

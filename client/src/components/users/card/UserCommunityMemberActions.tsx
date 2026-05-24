import type { CommunityMemberRole } from "../../../types/communities/members/CommunityMemberRole";

type Props = {
  userId: number;
  communityRole: CommunityMemberRole;
  loading?: boolean;
  onCommunityRoleChange?: (userId: number, role: CommunityMemberRole) => void;
  onRemoveCommunityMember?: (userId: number) => void;
};

export function UserCommunityMemberActions({
  userId,
  communityRole,
  loading = false,
  onCommunityRoleChange,
  onRemoveCommunityMember,
}: Props) {
  const nextCommunityRole: CommunityMemberRole =
    communityRole === "moderator" ? "member" : "moderator";

  const roleButtonLabel = communityRole === "moderator" ? "Demote" : "Promote";

  return (
    <>
      <button
        type="button"
        disabled={loading}
        onClick={() => onCommunityRoleChange?.(userId, nextCommunityRole)}
        className={`rounded-2xl border px-4 py-2 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
          communityRole === "moderator"
            ? "border-amber-400/20 bg-amber-500/10 text-amber-200 hover:bg-amber-500/15"
            : "border-sky-300/20 bg-sky-400/10 text-sky-100 hover:bg-sky-400/15"
        }`}
      >
        {loading ? "Saving..." : roleButtonLabel}
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={() => onRemoveCommunityMember?.(userId)}
        className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-200 transition-all hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Removing..." : "Remove"}
      </button>
    </>
  );
}

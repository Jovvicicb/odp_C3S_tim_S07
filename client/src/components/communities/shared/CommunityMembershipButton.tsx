import type { CommunityDto } from "../../../models/communities/CommunityDto";

type Props = {
  community: CommunityDto;
  loading?: boolean;
  onJoin?: (communityId: number) => void;
  onLeave?: (communityId: number) => void;
};

export function CommunityMembershipButton({
  community,
  loading = false,
  onJoin,
  onLeave,
}: Props) {
  const isActiveMember = community.membershipStatus === "active";
  const isPending = community.membershipStatus === "pending";
  const isBanned = community.membershipStatus === "banned";
  const canJoin = community.membershipStatus === null;

  const label = loading
    ? "Loading..."
    : isBanned
      ? "Banned"
      : isPending
        ? "Pending"
        : isActiveMember
          ? "Leave"
          : "Join";

  const disabled = loading || isPending || isBanned;

  const className = isActiveMember
    ? "border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
    : isPending
      ? "border-amber-400/20 bg-amber-500/10 text-amber-200"
      : isBanned
        ? "border-zinc-400/20 bg-zinc-500/10 text-zinc-300"
        : "border-sky-300/20 bg-sky-400/10 text-sky-100 hover:bg-sky-400/15";

  if (!canJoin && !isActiveMember && !isPending && !isBanned) {
    return null;
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();

        if (canJoin) {
          onJoin?.(community.id);
          return;
        }

        if (isActiveMember) {
          onLeave?.(community.id);
        }
      }}
      className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {label}
    </button>
  );
}

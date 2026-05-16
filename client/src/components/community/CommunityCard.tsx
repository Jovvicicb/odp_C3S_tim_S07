import type { CommunityDto } from "../../models/community/CommunityDto";
import { ImageHelper } from "../../helpers/images/ImageHelper";
import { useNavigate } from "react-router-dom";

type Props = {
  community: CommunityDto;
  showMembershipAction?: boolean;
  actionLoading?: boolean;
  onJoin?: (communityId: number) => void;
  onLeave?: (communityId: number) => void;
};

export function CommunityCard({
  community,
  actionLoading = false,
  showMembershipAction,
  onJoin,
  onLeave,
}: Props) {
  const createdAt = new Date(community.createdAt).toLocaleDateString();
  const navigate = useNavigate();
  const imageUrl = ImageHelper.getImageUrl(community.avatar);

  const isActiveMember = community.membershipStatus === "active";
  const isPending = community.membershipStatus === "pending";
  const isBanned = community.membershipStatus === "banned";
  const canJoin = community.membershipStatus === null;

  const buttonLabel = actionLoading
    ? "Loading..."
    : isBanned
      ? "Banned"
      : isPending
        ? "Pending"
        : isActiveMember
          ? "Leave"
          : "Join";

  const buttonDisabled = actionLoading || isPending || isBanned;

  const buttonStyle = isActiveMember
    ? "border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
    : isPending
      ? "border-amber-400/20 bg-amber-500/10 text-amber-200"
      : isBanned
        ? "border-zinc-400/20 bg-zinc-500/10 text-zinc-300"
        : "border-sky-300/20 bg-sky-400/10 text-sky-100 hover:bg-sky-400/15";

  return (
    <article
      onClick={() => navigate(`/communities/${community.id}`)}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-5 shadow-xl shadow-sky-950/10 transition-all hover:-translate-y-0.5 hover:border-sky-300/20"
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-400/5 blur-3xl transition-all group-hover:bg-sky-400/10" />

      <div className="relative z-10 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={community.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-lg font-semibold text-sky-200/70">
              {community.name[0]?.toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold tracking-tight text-white">
                {community.name}
              </h2>

              <p className="mt-1 text-xs text-white/30">
                Community #{community.id} · Created {createdAt}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`rounded-xl border px-3 py-1 text-xs font-semibold capitalize ${
                  community.type === "public"
                    ? "border-sky-400/15 bg-sky-400/10 text-sky-200/70"
                    : "border-amber-400/20 bg-amber-400/10 text-amber-300"
                }`}
              >
                {community.type}
              </span>

              {showMembershipAction &&
                (canJoin || isActiveMember || isPending || isBanned) && (
                  <button
                    type="button"
                    disabled={buttonDisabled}
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
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${buttonStyle}`}
                  >
                    {buttonLabel}
                  </button>
                )}
            </div>
          </div>

          <p className="mt-4 line-clamp-2 text-sm leading-7 text-white/45">
            {community.description || "No description provided."}
          </p>

          {community.rules && (
            <div className="mt-4 rounded-2xl border border-white/6 bg-white/3 px-4 py-3">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/25">
                Rules
              </p>

              <p className="line-clamp-2 text-xs leading-6 text-white/35">
                {community.rules}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

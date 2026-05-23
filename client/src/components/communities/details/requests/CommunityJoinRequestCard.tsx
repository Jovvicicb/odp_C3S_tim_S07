import { useNavigate } from "react-router-dom";
import type { CommunityMemberDetailsDto } from "../../../../models/communities/CommunityMemberDetailsDto";
import { ImageHelper } from "../../../../helpers/images/ImageHelper";

type Props = {
  request: CommunityMemberDetailsDto;
  actionLoading: boolean;
  onAccept: (userId: number) => void;
  onDeny: (userId: number) => void;
};

export function CommunityJoinRequestCard({
  request,
  actionLoading,
  onAccept,
  onDeny,
}: Props) {
  const navigate = useNavigate();

  const user = request.user;
  const imageUrl = ImageHelper.getImageUrl(user.image);
  const initial = user.username[0]?.toUpperCase() ?? "U";

  return (
    <article
      onClick={() => navigate(`/users/${user.id}`)}
      className="group h-full cursor-pointer rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-5 shadow-xl shadow-sky-950/10 transition-all hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-[#0e1520]/90"
    >
      <div className="flex items-start gap-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={user.username}
            className="h-14 w-14 shrink-0 rounded-2xl border border-white/10 object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/10">
            <span className="text-lg font-bold text-sky-200">{initial}</span>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-base font-semibold text-white">
                  {user.username}
                </h3>

                <span className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                  Pending
                </span>
              </div>

              <p className="mt-1 truncate text-sm text-white/40">
                {user.email}
              </p>

              {user.fullname && (
                <p className="mt-1 truncate text-xs text-white/30">
                  {user.fullname}
                </p>
              )}
            </div>

            <span className="shrink-0 text-white/25 transition-colors group-hover:text-sky-200">
              →
            </span>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/8 pt-4"
          >
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => onAccept(user.id)}
              className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-200 transition-all hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ? "Saving..." : "Accept"}
            </button>

            <button
              type="button"
              disabled={actionLoading}
              onClick={() => onDeny(user.id)}
              className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-200 transition-all hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ? "Saving..." : "Deny"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

import { useNavigate } from "react-router-dom";

import type { CommunityMemberDetailsDto } from "../../../../models/communities/CommunityMemberDetailsDto";
import { UserAvatar } from "../../../users/shared/UserAvatar";
import { Badge } from "../../../ui/Badge";

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

  return (
    <article
      onClick={() => navigate(`/users/${user.id}`)}
      className="group relative h-full cursor-pointer overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10 transition-all hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-[#0e1520]/90"
    >
      <div className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-amber-400/5 blur-3xl transition-all group-hover:bg-amber-400/10" />

      <div className="relative z-10 p-5">
        <div className="flex items-start gap-4">
          <UserAvatar username={user.username} image={user.image} size="md" />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-base font-bold tracking-tight text-white transition-colors group-hover:text-sky-100">
                    {user.username}
                  </h3>

                  <Badge tone="amber" className="text-[11px] font-bold">
                    Pending
                  </Badge>
                </div>

                <p className="mt-1 truncate text-sm text-white/40">
                  {user.email}
                </p>

                {user.fullname && (
                  <p className="mt-1 truncate text-xs text-white/28">
                    {user.fullname}
                  </p>
                )}
              </div>

              <span className="shrink-0 text-sm font-bold text-white/20 transition-colors group-hover:text-sky-200">
                →
              </span>
            </div>

            <p className="mt-4 text-xs leading-5 text-white/30">
              This user is waiting for approval to join the community.
            </p>
          </div>
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/8 pt-4"
        >
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => onDeny(user.id)}
            className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-200 transition-all hover:-translate-y-0.5 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {actionLoading ? "Saving..." : "Deny"}
          </button>

          <button
            type="button"
            disabled={actionLoading}
            onClick={() => onAccept(user.id)}
            className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-200 transition-all hover:-translate-y-0.5 hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {actionLoading ? "Saving..." : "Accept"}
          </button>
        </div>
      </div>
    </article>
  );
}

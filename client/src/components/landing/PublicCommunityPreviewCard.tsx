import { useNavigate } from "react-router-dom";

import { ImageHelper } from "../../helpers/images/ImageHelper";
import type { CommunityDto } from "../../models/communities/CommunityDto";

import { Badge } from "../ui/badge/Badge";
import { CommunityAvatar } from "../communities/card/CommunityAvatar";
import { CommunityTypeBadge } from "../communities/card/CommunityTypeBadge";

type Props = {
  community: CommunityDto;
};

export function PublicCommunityPreviewCard({ community }: Props) {
  const navigate = useNavigate();

  const imageUrl = ImageHelper.getImageUrl(community.avatar);
  const initial = community.name[0]?.toUpperCase() ?? "#";

  return (
    <article
      onClick={() => navigate(`/communities/${community.id}`)}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-5 shadow-xl shadow-sky-950/10 transition-all hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-[#0e1520]/90"
    >
      <div className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-sky-400/5 blur-3xl transition-all group-hover:bg-sky-400/10" />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <CommunityAvatar
            name={community.name}
            imageUrl={imageUrl}
            initial={initial}
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-white transition-colors group-hover:text-sky-100">
                {community.name}
              </h3>

              <CommunityTypeBadge type={community.type} />
            </div>

            <p className="mt-2 text-xs text-white/35">
              By{" "}
              <span className="font-semibold text-sky-100/65">
                {community.ownerUsername ?? "Unavailable user"}
              </span>
            </p>

            <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/50">
              {community.description || "No description provided."}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/6 pt-4">
          <Badge tone="muted" className="rounded-2xl px-3 py-1.5">
            Public community
          </Badge>

          <span className="text-xs font-bold text-sky-200/60 transition-colors group-hover:text-sky-200">
            Open →
          </span>
        </div>
      </div>
    </article>
  );
}

import type { CommunityDto } from "../../models/community/CommunityDto";
import { ImageHelper } from "../../helpers/images/ImageHelper";

type Props = {
  community: CommunityDto;
};

export function CommunityCard({ community }: Props) {
  const createdAt = new Date(community.createdAt).toLocaleDateString();
  const imageUrl = ImageHelper.getImageUrl(community.avatar);

  return (
    <article className="bg-white/2 border border-white/6 rounded-2xl p-5 hover:border-white/12 hover:bg-white/4 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={community.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white/35 text-lg">
              {community.name[0]?.toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-white/85 text-sm font-semibold truncate">
                {community.name}
              </h2>

              <p className="text-white/25 text-xs mt-1">
                Owner ID: {community.ownerId} · Created: {createdAt}
              </p>
            </div>

            <span
              className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                community.type === "public"
                  ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              {community.type}
            </span>
          </div>

          <p className="text-white/40 text-sm mt-3 line-clamp-2">
            {community.description || "No description provided."}
          </p>

          {community.rules && (
            <p className="text-white/25 text-xs mt-3 line-clamp-2">
              Rules: {community.rules}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

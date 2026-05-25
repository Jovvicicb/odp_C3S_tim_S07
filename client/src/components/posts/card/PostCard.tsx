import { useNavigate } from "react-router-dom";

import { ImageHelper } from "../../../helpers/images/ImageHelper";
import type { PostWithDetailsDto } from "../../../models/posts/PostWithDetailsDto";

import { Badge } from "../../ui/Badge";
import { PostTagBadge } from "../shared/PostTagBadge";

type Props = {
  post: PostWithDetailsDto;
};

export function PostCard({ post }: Props) {
  const navigate = useNavigate();

  const imageUrl = ImageHelper.getImageUrl(post.mediaUrl);
  const createdAt = new Date(post.createdAt).toLocaleDateString();

  return (
    <article
      onClick={() => navigate(`/posts/${post.id}`)}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10 transition-all hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-[#0e1520]/90"
    >
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-sky-400/5 blur-3xl transition-all group-hover:bg-sky-400/10" />

      <div className="relative z-10">
        {imageUrl && (
          <div className="overflow-hidden border-b border-white/8 bg-white/3">
            <img
              src={imageUrl}
              alt={post.title}
              className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        )}

        <div className="p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 text-xl font-bold tracking-tight text-white transition-colors group-hover:text-sky-100">
                {post.title}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/35">
                <span>
                  By{" "}
                  <span className="font-semibold text-sky-100/65">
                    {post.authorUsername ?? "Unavailable user"}
                  </span>
                </span>

                <span className="text-white/15">•</span>

                <span>Created {createdAt}</span>
              </div>
            </div>

            <span className="shrink-0 text-xs font-bold text-sky-200/60 transition-colors group-hover:text-sky-200">
              View post →
            </span>
          </div>

          {post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <PostTagBadge key={tag.id} name={tag.name} />
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/6 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="muted" className="rounded-2xl px-3 py-1.5">
                {post.likeCount} {post.likeCount === 1 ? "like" : "likes"}
              </Badge>

              <Badge tone="muted" className="rounded-2xl px-3 py-1.5">
                {post.commentCount}{" "}
                {post.commentCount === 1 ? "comment" : "comments"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

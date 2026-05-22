import { useNavigate } from "react-router-dom";
import type { PostWithDetailsDto } from "../../models/posts/PostWithDetailsDto";
import { ImageHelper } from "../../helpers/images/ImageHelper";

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
          <div className="border-b border-white/8 bg-white/3">
            <img
              src={imageUrl}
              alt={post.title}
              className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-xl border border-white/8 bg-white/4 px-2.5 py-1 text-[11px] font-semibold text-white/35">
                  Post #{post.id}
                </span>

                <span className="rounded-xl border border-white/8 bg-white/4 px-2.5 py-1 text-[11px] font-semibold text-white/35">
                  Created {createdAt}
                </span>
              </div>

              <h2 className="mt-3 line-clamp-2 text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-sky-100">
                {post.title}
              </h2>
            </div>

            <div className="shrink-0 rounded-2xl border border-sky-300/15 bg-sky-400/10 px-3 py-2 text-xs font-semibold text-sky-100/70">
              Community #{post.communityId}
            </div>
          </div>

          {post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-xl border border-sky-300/15 bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-sky-100/60"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-white/6 pt-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-white/35">
              <span className="rounded-xl border border-white/8 bg-white/3 px-3 py-1.5">
                {post.likeCount} likes
              </span>

              <span className="rounded-xl border border-white/8 bg-white/3 px-3 py-1.5">
                {post.commentCount} comments
              </span>
            </div>

            <span className="text-xs font-semibold text-sky-200/60 transition-colors group-hover:text-sky-200">
              View post →
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

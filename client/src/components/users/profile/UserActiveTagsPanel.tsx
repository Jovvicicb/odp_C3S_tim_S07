import { useMemo } from "react";

import { Badge } from "../../ui/badge/Badge";
import { CountBadge } from "../../ui/badge/CountBadge";
import { SectionCard } from "../../ui/card/SectionCard";
import { SectionEmptyState } from "../../ui/empty/SectionEmptyState";
import { Spinner } from "../../ui/spinner/Spinner";

import type { PostWithDetailsDto } from "../../../models/posts/PostWithDetailsDto";

type Props = {
  posts: PostWithDetailsDto[];
  loading: boolean;
  isOwnProfile: boolean;
};

type ActiveTag = {
  id: number;
  name: string;
  count: number;
};

export function UserActiveTagsPanel({ posts, loading, isOwnProfile }: Props) {
  const activeTags = useMemo<ActiveTag[]>(() => {
    const tagMap = new Map<number, ActiveTag>();

    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        const existing = tagMap.get(tag.id);

        if (existing) {
          tagMap.set(tag.id, {
            ...existing,
            count: existing.count + 1,
          });

          return;
        }

        tagMap.set(tag.id, {
          id: tag.id,
          name: tag.name,
          count: 1,
        });
      });
    });

    return Array.from(tagMap.values()).sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      return a.name.localeCompare(b.name);
    });
  }, [posts]);

  const topTags = activeTags.slice(0, 4);
  const maxCount = topTags[0]?.count ?? 0;

  return (
    <SectionCard
      label="Tag activity"
      title="Most active tags"
      description={
        isOwnProfile
          ? "A visual overview of the tags you use most often in your posts."
          : "A visual overview of the tags this user uses most often in visible posts."
      }
      action={
        <CountBadge count={activeTags.length} singular="tag" plural="tags" />
      }
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size={24} />
        </div>
      ) : topTags.length === 0 ? (
        <SectionEmptyState
          title="No tag activity yet."
          description={
            isOwnProfile
              ? "Add tags to your posts to build your activity overview."
              : "This user does not have visible tagged posts yet."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {topTags.map((tag, index) => {
            const percentage =
              maxCount > 0 ? Math.max((tag.count / maxCount) * 100, 12) : 0;

            const isTopTag = index === 0;

            return (
              <article
                key={tag.id}
                className={`relative overflow-hidden rounded-3xl border p-5 transition-all hover:-translate-y-0.5 ${
                  isTopTag
                    ? "border-sky-300/20 bg-sky-400/8 shadow-xl shadow-sky-500/5"
                    : "border-white/8 bg-white/3"
                }`}
              >
                <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-sky-400/8 blur-3xl" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border text-sm font-black ${
                          isTopTag
                            ? "border-sky-300/20 bg-sky-400/15 text-sky-100"
                            : "border-white/10 bg-white/5 text-white/45"
                        }`}
                      >
                        {index + 1}
                      </span>

                      <div className="min-w-0">
                        <span
                          className={`block max-w-full truncate text-base font-black tracking-tight ${
                            isTopTag ? "text-sky-100" : "text-white/80"
                          }`}
                        >
                          #{tag.name}
                        </span>

                        <p className="mt-2 text-xs text-white/30">
                          Used in{" "}
                          <span className="font-bold text-white/55">
                            {tag.count}
                          </span>{" "}
                          {tag.count === 1 ? "post" : "posts"}
                        </p>
                      </div>
                    </div>

                    {isTopTag && (
                      <Badge tone="amber" className="shrink-0">
                        Top tag
                      </Badge>
                    )}
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-white/30">
                      <span>Activity</span>
                      <span>{Math.round(percentage)}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/6">
                      <div
                        className="h-full rounded-full bg-emerald-300/75 shadow-[0_0_18px_rgba(110,231,183,0.35)]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}

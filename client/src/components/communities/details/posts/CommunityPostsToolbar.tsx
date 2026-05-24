import { SectionLabel } from "../../../ui/SectionLabel";
import type { PostTagDto } from "../../../../models/tags/PostTagDto";
import type { PostSortType } from "../../../../types/posts/PostSortType";

import { PostTagFilterButton } from "./PostTagFilterButton";

type Props = {
  tags: PostTagDto[];
  selectedTagId: number | null;
  selectedTagName: string;
  sort: PostSortType;
  onTagChange: (tagId: number | null) => void;
  onSortChange: (sort: PostSortType) => void;
};

export function CommunityPostsToolbar({
  tags,
  selectedTagId,
  selectedTagName,
  sort,
  onTagChange,
  onSortChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_260px] xl:items-start">
      <div>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <SectionLabel label="Filter by tag" tone="muted" />

            <p className="text-xs text-white/25">
              Active filter:{" "}
              <span className="font-semibold text-sky-100/70">
                {selectedTagId === null
                  ? selectedTagName
                  : `#${selectedTagName}`}
              </span>
            </p>
          </div>

          {selectedTagId !== null && (
            <button
              type="button"
              onClick={() => onTagChange(null)}
              className="w-fit rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/45 transition-all hover:bg-white/8 hover:text-white/70"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <PostTagFilterButton
            label="All"
            active={selectedTagId === null}
            onClick={() => onTagChange(null)}
          />

          {tags.map((tag) => (
            <PostTagFilterButton
              key={tag.id}
              label={`#${tag.name}`}
              active={selectedTagId === tag.id}
              onClick={() => onTagChange(tag.id)}
            />
          ))}

          {tags.length === 0 && (
            <span className="rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-xs font-medium text-white/25">
              No tags yet
            </span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="post-sort" className="block">
          <SectionLabel label="Sort posts" tone="muted" />
        </label>

        <select
          id="post-sort"
          name="post-sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as PostSortType)}
          className="w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-sm font-semibold text-white/75 outline-none transition-all hover:border-sky-300/30 focus:border-sky-300/40"
        >
          <option value="newest" className="bg-[#07111f] text-white">
            Newest
          </option>

          <option value="popular" className="bg-[#07111f] text-white">
            Most popular
          </option>

          <option value="mostCommented" className="bg-[#07111f] text-white">
            Most commented
          </option>
        </select>

        <p className="mt-2 text-xs text-white/25">
          Sorting resets the selected tag filter.
        </p>
      </div>
    </div>
  );
}

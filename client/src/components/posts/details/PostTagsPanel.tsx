import { useEffect, useMemo, useState } from "react";
import { tagApi } from "../../../api_services/tags/TagAPIService";
import { TagMessages } from "../../../constants/messages/tag/TagMessages";
import type { TagDto } from "../../../models/tags/TagDto";
import type { PostTagDto } from "../../../models/tags/PostTagDto";

type Props = {
  postId: number;
  tags: PostTagDto[];
  canManageTags: boolean;
  loadingPostTagAddId: number | null;
  loadingPostTagRemoveId: number | null;
  onAddTag: (postId: number, tag: PostTagDto) => Promise<boolean>;
  onRemoveTag: (postId: number, tagId: number) => Promise<boolean>;
};

export function PostTagsPanel({
  postId,
  tags,
  canManageTags,
  loadingPostTagAddId,
  loadingPostTagRemoveId,
  onAddTag,
  onRemoveTag,
}: Props) {
  const [availableTags, setAvailableTags] = useState<TagDto[]>([]);
  const [availableTagsLoaded, setAvailableTagsLoaded] = useState(false);
  const [availableTagsError, setAvailableTagsError] = useState("");
  const [selectedTagId, setSelectedTagId] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!canManageTags) return;

    let cancelled = false;

    const loadAvailableTags = async () => {
      try {
        const res = await tagApi.getAll(1, 100);

        if (cancelled) return;

        if (!res.success || !res.data) {
          setAvailableTagsError(res.message ?? TagMessages.fetchAllFailed);
          setAvailableTags([]);
          return;
        }

        setAvailableTagsError("");
        setAvailableTags(res.data.items);
      } catch {
        if (!cancelled) {
          setAvailableTagsError(TagMessages.fetchAllFailed);
          setAvailableTags([]);
        }
      } finally {
        if (!cancelled) {
          setAvailableTagsLoaded(true);
        }
      }
    };

    void loadAvailableTags();

    return () => {
      cancelled = true;
    };
  }, [canManageTags]);

  const assignedTagIds = useMemo(
    () => new Set(tags.map((tag) => tag.id)),
    [tags],
  );

  const availableOptions = useMemo(
    () => availableTags.filter((tag) => !assignedTagIds.has(tag.id)),
    [availableTags, assignedTagIds],
  );

  const handleAddTag = async () => {
    if (!selectedTagId) {
      setLocalError("Select a tag first");
      return;
    }

    const selectedTag = availableOptions.find(
      (tag) => String(tag.id) === selectedTagId,
    );

    if (!selectedTag) {
      setLocalError("Selected tag is not available");
      return;
    }

    setLocalError("");

    const success = await onAddTag(postId, {
      id: selectedTag.id,
      name: selectedTag.name,
    });

    if (success) {
      setSelectedTagId("");
    }
  };

  return (
    <section className="rounded-3xl border border-white/8 bg-white/3 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_16px_rgba(125,211,252,0.8)]" />

          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-sky-200/70">
            TAGS
          </p>
        </div>

        <span className="rounded-xl border border-white/10 bg-white/4 px-3 py-1 text-xs font-semibold text-white/35">
          {tags.length} {tags.length === 1 ? "tag" : "tags"}
        </span>
      </div>

      <div className="mt-4">
        {tags.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-4 py-4 text-sm text-white/30">
            No tags attached.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-2 rounded-xl border border-sky-300/15 bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-sky-100 transition-all hover:border-sky-300/25 hover:bg-sky-400/15"
              >
                #{tag.name}
                {canManageTags && (
                  <button
                    type="button"
                    disabled={loadingPostTagRemoveId === tag.id}
                    onClick={() => void onRemoveTag(postId, tag.id)}
                    className="rounded-lg px-1.5 py-0.5 text-sky-100/55 transition-all hover:bg-red-500/15 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`Remove ${tag.name} tag`}
                  >
                    {loadingPostTagRemoveId === tag.id ? "..." : "×"}
                  </button>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {canManageTags && (
        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-white/8 pt-4 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <select
              id="post-tag-select"
              value={selectedTagId}
              disabled={!availableTagsLoaded || availableOptions.length === 0}
              onChange={(e) => {
                setSelectedTagId(e.target.value);
                setLocalError("");
              }}
              className="w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-sm font-semibold text-white/75 outline-none transition-all hover:border-sky-300/25 focus:border-sky-300/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" className="bg-[#07111f] text-white">
                {availableTagsLoaded ? "Select tag..." : "Loading tags..."}
              </option>

              {availableOptions.map((tag) => (
                <option
                  key={tag.id}
                  value={tag.id}
                  className="bg-[#07111f] text-white"
                >
                  #{tag.name}
                </option>
              ))}
            </select>

            {(localError || availableTagsError) && (
              <p className="mt-2 text-xs font-medium text-red-300">
                {localError || availableTagsError}
              </p>
            )}

            {availableTagsLoaded &&
              !availableTagsError &&
              availableOptions.length === 0 && (
                <p className="mt-2 text-xs text-white/25">
                  All global tags are already attached.
                </p>
              )}
          </div>

          <button
            type="button"
            disabled={!selectedTagId || loadingPostTagAddId !== null}
            onClick={() => void handleAddTag()}
            className="rounded-2xl border border-sky-300/20 bg-sky-400/10 px-5 py-3 text-xs font-bold text-sky-100 transition-all hover:bg-sky-400/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingPostTagAddId !== null ? "Adding..." : "Add tag"}
          </button>
        </div>
      )}
    </section>
  );
}

import { useEffect, useMemo, useState } from "react";

import { tagApi } from "../../../../api_services/tags/TagAPIService";
import { TagMessages } from "../../../../constants/messages/tag/TagMessages";

import type { TagDto } from "../../../../models/tags/TagDto";
import type { PostTagDto } from "../../../../models/tags/PostTagDto";

import { Button } from "../../../ui/button/Button";
import { CountBadge } from "../../../ui/badge/CountBadge";
import { SectionEmptyState } from "../../../ui/empty/SectionEmptyState";
import { SectionLabel } from "../../../ui/label/SectionLabel";
import { PostTagBadge } from "../../shared/PostTagBadge";

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
    if (!canManageTags) {
      return;
    }

    let cancelled = false;

    const loadAvailableTags = async () => {
      try {
        const res = await tagApi.getAll(1, 100);

        if (cancelled) {
          return;
        }

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

  const hasTags = tags.length > 0;
  const addLoading = loadingPostTagAddId !== null;

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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <SectionLabel label="Tags" tone="sky" />

          <p className="mt-2 text-sm leading-6 text-white/35">
            Tags describe the main topics covered in this post.
          </p>
        </div>

        <CountBadge count={tags.length} singular="tag" plural="tags" />
      </div>

      <div className="mt-4">
        {!hasTags ? (
          <SectionEmptyState
            title="No tags attached."
            description={
              canManageTags
                ? "Select a global tag below to describe this post."
                : "Tags will appear here when they are attached to this post."
            }
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <PostTagBadge
                key={tag.id}
                name={tag.name}
                removable={canManageTags}
                removing={loadingPostTagRemoveId === tag.id}
                onRemove={() => void onRemoveTag(postId, tag.id)}
              />
            ))}
          </div>
        )}
      </div>

      {canManageTags && (
        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-white/8 pt-4 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <label htmlFor="post-tag-select" className="block">
              <SectionLabel label="Add tag" tone="muted" />
            </label>

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
                <p className="mt-2 text-xs text-white/30">
                  All global tags are already attached.
                </p>
              )}
          </div>

          <Button
            label="Add tag"
            loadingLabel="Adding..."
            loading={addLoading}
            disabled={!selectedTagId}
            variant="primary"
            className="md:mt-5"
            onClick={() => void handleAddTag()}
          />
        </div>
      )}
    </section>
  );
}

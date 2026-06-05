import { useState } from "react";

import { CommentValidationMessages } from "../../../constants/messages/comment/CommentValidationMessages";
import {
  getMentionQuery,
  insertMention,
} from "../../../helpers/comments/CommentMentionHelper";
import { useUserMentionSearch } from "../../../hooks/users/search/useUserMentionSearch";

import { Badge } from "../../ui/badge/Badge";
import { Button } from "../../ui/button/Button";

type Props = {
  title?: string;
  description?: string;
  placeholder?: string;
  submitLabel?: string;
  loading?: boolean;
  compact?: boolean;
  initialValue?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  onSubmit: (content: string) => Promise<boolean>;
};

export function CommentForm({
  title = "Add a comment",
  description = "Share your thoughts with the discussion.",
  placeholder = "Write your comment...",
  submitLabel = "Post comment",
  loading = false,
  compact = false,
  initialValue = "",
  cancelLabel = "Cancel",
  onCancel,
  onSubmit,
}: Props) {
  const [content, setContent] = useState(initialValue);
  const [localError, setLocalError] = useState("");

  const characterLimit = 2000;
  const trimmedContent = content.trim();
  const isEmpty = trimmedContent.length === 0;
  const isNearLimit = content.length >= characterLimit * 0.9;

  const mentionQuery = getMentionQuery(content);

  const { users: mentionUsers, loading: mentionLoading } =
    useUserMentionSearch(mentionQuery);

  const showMentionSuggestions = mentionQuery.length >= 2;

  const handleInsertMention = (username: string) => {
    setContent((current) => insertMention(current, username));
    setLocalError("");
  };

  const handleSubmit = async () => {
    if (isEmpty) {
      setLocalError(CommentValidationMessages.contentRequired);
      return;
    }

    setLocalError("");

    const success = await onSubmit(trimmedContent);

    if (success) {
      setContent("");
    }
  };

  return (
    <div
      className={`rounded-3xl border border-white/8 bg-white/3 shadow-inner shadow-black/10 ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_14px_rgba(125,211,252,0.75)]" />

            <h3 className="text-sm font-bold tracking-tight text-white">
              {title}
            </h3>
          </div>

          {description && (
            <p className="mt-2 text-xs leading-5 text-white/35">
              {description}
            </p>
          )}
        </div>

        <Badge
          tone={isNearLimit ? "amber" : "muted"}
          className="w-fit text-[11px]"
        >
          {content.length}/{characterLimit}
        </Badge>
      </div>

      <textarea
        value={content}
        disabled={loading}
        onChange={(e) => {
          setContent(e.target.value);
          setLocalError("");
        }}
        placeholder={placeholder}
        maxLength={characterLimit}
        rows={compact ? 3 : 4}
        className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-[#07111f]/90 px-4 py-3 text-sm leading-6 text-white/80 outline-none transition-all placeholder:text-white/25 hover:border-sky-300/25 focus:border-sky-300/40 focus:bg-[#081522] disabled:cursor-not-allowed disabled:opacity-60"
      />

      {showMentionSuggestions && (
        <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#07111f] shadow-xl shadow-sky-950/20">
          {mentionLoading ? (
            <p className="px-4 py-3 text-xs text-white/35">
              Searching users...
            </p>
          ) : mentionUsers.length === 0 ? (
            <p className="px-4 py-3 text-xs text-white/35">
              No users found for @{mentionQuery}.
            </p>
          ) : (
            <div className="max-h-56 overflow-y-auto p-2">
              {mentionUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleInsertMention(user.username)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-all hover:bg-sky-400/10"
                >
                  <span className="text-sm font-semibold text-sky-100/80">
                    @{user.username}
                  </span>

                  {user.fullname && (
                    <span className="truncate text-xs text-white/30">
                      {user.fullname}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {localError ? (
            <p className="text-xs font-medium text-red-300">{localError}</p>
          ) : (
            <p className="text-xs text-white/25">
              Use @username to mention users. Comments are visible to everyone
              who can view this post.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          {onCancel && (
            <Button
              label={cancelLabel}
              variant="secondary"
              size="md"
              disabled={loading}
              onClick={onCancel}
            />
          )}

          <Button
            label={submitLabel}
            loadingLabel="Saving..."
            loading={loading}
            disabled={isEmpty}
            variant="primary"
            size="md"
            onClick={() => void handleSubmit()}
          />
        </div>
      </div>
    </div>
  );
}

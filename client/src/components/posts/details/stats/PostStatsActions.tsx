type Props = {
  likeCount: number;
  commentCount: number;
  canLikePost: boolean;
  canEditPost: boolean;
  canDeletePost: boolean;
  likedByCurrentUser: boolean;
  loadingPostLike: boolean;
  loadingPostDelete: boolean;
  onLike: () => void;
  onUnlike: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function PostStatsActions({
  likeCount,
  commentCount,
  canLikePost,
  canEditPost,
  canDeletePost,
  likedByCurrentUser,
  loadingPostLike,
  loadingPostDelete,
  onLike,
  onUnlike,
  onEdit,
  onDelete,
}: Props) {
  const hasManagementActions = canEditPost || canDeletePost;

  return (
    <div className="flex flex-col gap-3 lg:items-end">
      <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
        {canLikePost && (
          <button
            type="button"
            disabled={loadingPostLike}
            onClick={() => {
              if (likedByCurrentUser) {
                onUnlike();
                return;
              }

              onLike();
            }}
            className={`rounded-2xl border px-4 py-2 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
              likedByCurrentUser
                ? "border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
                : "border-sky-300/20 bg-sky-400/10 text-sky-100 hover:bg-sky-400/15"
            }`}
          >
            {loadingPostLike
              ? "Loading..."
              : likedByCurrentUser
                ? "Unlike"
                : "Like"}
          </button>
        )}

        {hasManagementActions && (
          <div className="flex flex-wrap gap-2 border-l border-white/10 pl-2">
            {canEditPost && (
              <button
                type="button"
                onClick={onEdit}
                className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-200 transition-all hover:bg-amber-500/15"
              >
                Edit
              </button>
            )}

            {canDeletePost && (
              <button
                type="button"
                disabled={loadingPostDelete}
                onClick={onDelete}
                className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-200 transition-all hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingPostDelete ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
        <StatBadge label="Likes" value={likeCount} tone="primary" />
        <StatBadge label="Comments" value={commentCount} tone="muted" />
      </div>
    </div>
  );
}

function StatBadge({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "primary" | "muted";
}) {
  return (
    <span
      className={`rounded-2xl border px-3 py-1.5 text-xs font-semibold ${
        tone === "primary"
          ? "border-sky-300/15 bg-sky-400/10 text-sky-100"
          : "border-white/10 bg-white/5 text-white/50"
      }`}
    >
      {value} {label.toLowerCase()}
    </span>
  );
}

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
  return (
    <div className="flex shrink-0 flex-wrap gap-2">
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

      <span className="rounded-2xl border border-sky-300/15 bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-sky-100">
        {likeCount} likes
      </span>

      <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/50">
        {commentCount} comments
      </span>
    </div>
  );
}

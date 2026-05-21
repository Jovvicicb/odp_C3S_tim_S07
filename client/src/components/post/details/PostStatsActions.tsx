type Props = {
  likeCount: number;
  commentCount: number;
  canLikePost: boolean;
  likedByCurrentUser: boolean;
  loadingPostLike: boolean;
  onLike: () => void;
  onUnlike: () => void;
};

export function PostStatsActions({
  likeCount,
  commentCount,
  canLikePost,
  likedByCurrentUser,
  loadingPostLike,
  onLike,
  onUnlike,
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

      <span className="rounded-2xl border border-sky-300/15 bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-sky-100">
        {likeCount} likes
      </span>

      <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/50">
        {commentCount} comments
      </span>
    </div>
  );
}

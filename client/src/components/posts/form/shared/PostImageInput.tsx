type Props = {
  fileKey: number;
  preview: string;
  currentImageUrl?: string | null;
  removeCurrentImage?: boolean;
  onChange: (file?: File) => void;
  onRemoveCurrentImage?: () => void;
  onUndoRemoveCurrentImage?: () => void;
};

export function PostImageInput({
  fileKey,
  preview,
  currentImageUrl = null,
  removeCurrentImage = false,
  onChange,
  onRemoveCurrentImage,
  onUndoRemoveCurrentImage,
}: Props) {
  const showCurrentImage = currentImageUrl && !preview && !removeCurrentImage;
  const showRemoveNotice = currentImageUrl && removeCurrentImage && !preview;

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="post-image"
          className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35"
        >
          Image
        </label>

        <input
          key={fileKey}
          id="post-image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => onChange(e.target.files?.[0])}
          className="w-full rounded-2xl border border-white/10 bg-white/4 px-3 py-2 text-sm text-white transition-all file:mr-3 file:rounded-xl file:border-0 file:bg-sky-400/15 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-sky-200 hover:border-white/20 hover:file:bg-sky-400/20 focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
        />
      </div>

      {showCurrentImage && (
        <ImagePreviewPanel
          imageUrl={currentImageUrl}
          title="Current image"
          description="This image is currently attached to the post."
          actionLabel="Remove image"
          actionTone="danger"
          onAction={onRemoveCurrentImage}
        />
      )}

      {showRemoveNotice && (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-red-200">
                Current image will be removed.
              </p>

              <p className="mt-1 text-xs text-red-100/50">
                Save changes to apply this update.
              </p>
            </div>

            {onUndoRemoveCurrentImage && (
              <button
                type="button"
                onClick={onUndoRemoveCurrentImage}
                className="w-fit rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/65 transition-all hover:bg-white/8 hover:text-white"
              >
                Undo
              </button>
            )}
          </div>
        </div>
      )}

      {preview && (
        <ImagePreviewPanel
          imageUrl={preview}
          title="New image preview"
          description="This image will replace the current post image after saving."
        />
      )}
    </div>
  );
}

function ImagePreviewPanel({
  imageUrl,
  title,
  description,
  actionLabel,
  actionTone = "neutral",
  onAction,
}: {
  imageUrl: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionTone?: "neutral" | "danger";
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/3 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <img
          src={imageUrl}
          alt={title}
          className="h-16 w-16 rounded-2xl border border-white/20 object-cover"
        />

        <div>
          <p className="text-sm font-semibold text-white/70">{title}</p>

          <p className="mt-1 text-xs text-white/30">{description}</p>
        </div>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className={`w-fit rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
            actionTone === "danger"
              ? "border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
              : "border-white/10 bg-white/5 text-white/60 hover:bg-white/8 hover:text-white"
          }`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

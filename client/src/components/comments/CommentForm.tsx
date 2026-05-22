import { useState } from "react";
import { CommentValidationMessages } from "../../constants/messages/comment/CommentValidationMessages";

type Props = {
  title?: string;
  placeholder?: string;
  submitLabel?: string;
  loading?: boolean;
  onSubmit: (content: string) => Promise<boolean>;
};

export function CommentForm({
  title = "Add a comment",
  placeholder = "Write your comment...",
  submitLabel = "Post comment",
  loading = false,
  onSubmit,
}: Props) {
  const [content, setContent] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
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
    <div className="rounded-3xl border border-white/8 bg-white/3 p-5">
      <h3 className="text-sm font-semibold text-white">{title}</h3>

      <textarea
        value={content}
        disabled={loading}
        onChange={(e) => {
          setContent(e.target.value);
          setLocalError("");
        }}
        placeholder={placeholder}
        maxLength={2000}
        rows={4}
        className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-sm leading-6 text-white/80 outline-none transition-all placeholder:text-white/25 hover:border-sky-300/25 focus:border-sky-300/40 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <p className="mt-2 text-right text-xs text-white/25">
        {content.length}/2000
      </p>

      {localError && (
        <p className="mt-2 text-xs font-medium text-red-300">{localError}</p>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          disabled={loading}
          onClick={() => void handleSubmit()}
          className="rounded-2xl border border-sky-300/20 bg-sky-400/10 px-5 py-2.5 text-xs font-bold text-sky-100 transition-all hover:bg-sky-400/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Posting..." : submitLabel}
        </button>
      </div>
    </div>
  );
}

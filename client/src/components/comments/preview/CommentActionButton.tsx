type CommentActionTone = "primary" | "neutral" | "warning" | "danger";

type Props = {
  children: string;
  tone: CommentActionTone;
  disabled?: boolean;
  onClick?: () => void;
};

const toneStyles: Record<CommentActionTone, string> = {
  primary: "border-sky-300/20 bg-sky-400/10 text-sky-100 hover:bg-sky-400/15",
  neutral:
    "border-white/10 bg-white/5 text-white/60 hover:border-sky-300/20 hover:bg-sky-400/10 hover:text-sky-100",
  warning:
    "border-amber-400/20 bg-amber-500/10 text-amber-200 hover:bg-amber-500/15",
  danger: "border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/15",
};

export function CommentActionButton({
  children,
  tone,
  disabled = false,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${toneStyles[tone]}`}
    >
      {children}
    </button>
  );
}

type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "ghost";

type ButtonSize = "sm" | "md";

type Props = {
  label: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border-sky-300/20 bg-sky-400/10 text-sky-100 hover:border-sky-300/30 hover:bg-sky-400/15",
  secondary:
    "border-white/10 bg-white/4 text-white/65 hover:border-white/20 hover:bg-white/8 hover:text-white",
  success:
    "border-emerald-400/20 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/15",
  warning:
    "border-amber-400/20 bg-amber-500/10 text-amber-200 hover:bg-amber-500/15",
  danger: "border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/15",
  ghost:
    "border-transparent bg-transparent text-white/40 hover:bg-white/5 hover:text-white/70",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-xs",
};

export function Button({
  label,
  loadingLabel = "Saving...",
  loading = false,
  disabled = false,
  variant = "secondary",
  size = "md",
  type = "button",
  onClick,
  className = "",
}: Props) {
  const isDisabled = loading || disabled;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`
        rounded-2xl border font-bold transition-all
        hover:-translate-y-0.5 active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {loading ? loadingLabel : label}
    </button>
  );
}

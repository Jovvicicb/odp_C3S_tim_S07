type Variant = "primary" | "danger";

type Props = {
  label: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  className?: string;
};

const variantStyles: Record<Variant, string> = {
  primary: "bg-sky-400 text-slate-950 shadow-sky-500/20 hover:bg-sky-300",
  danger: "bg-red-400 text-slate-950 shadow-red-500/20 hover:bg-red-300",
};

export function SubmitButton({
  label,
  loadingLabel = "Please wait...",
  loading = false,
  disabled = false,
  variant = "primary",
  className = "",
}: Props) {
  const isDisabled = loading || disabled;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`
        mt-2 rounded-2xl px-6 py-4 text-sm font-bold
        shadow-lg transition-all hover:-translate-y-0.5
        disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
          {loadingLabel}
        </div>
      ) : (
        label
      )}
    </button>
  );
}

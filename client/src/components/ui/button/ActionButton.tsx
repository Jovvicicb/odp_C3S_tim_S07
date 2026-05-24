import { useNavigate } from "react-router-dom";

type Variant = "create" | "back";

type Size = "sm" | "md" | "lg";

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-2",
  md: "h-11 px-4 text-sm gap-2.5",
  lg: "h-12 px-5 text-base gap-3",
};

const variantStyles: Record<Variant, string> = {
  create:
    "border border-sky-300/20 bg-sky-400/10 text-sky-100 hover:bg-sky-400/15 hover:border-sky-300/30 shadow-lg shadow-sky-500/10",
  back: "border border-white/10 bg-white/4 text-white/65 hover:bg-white/8 hover:border-white/20 hover:text-white",
};

const defaultIcons: Record<Variant, string> = {
  create: "+",
  back: "←",
};

type Props = {
  variant: Variant;
  label?: string;
  to?: string;
  onClick?: () => void;
  className?: string;
  size?: Size;
  disabled?: boolean;
  icon?: string;
};

export function ActionButton({
  variant,
  label,
  to,
  onClick,
  className = "",
  size = "md",
  disabled = false,
  icon,
}: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;

    if (onClick) {
      onClick();
      return;
    }

    if (variant === "back") {
      navigate(-1);
      return;
    }

    if (to) {
      navigate(to);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={label ?? variant}
      className={`
        inline-flex items-center justify-center rounded-2xl
        font-semibold tracking-tight transition-all duration-200
        hover:-translate-y-0.5 active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
    >
      <span className="text-lg leading-none">
        {icon ?? defaultIcons[variant]}
      </span>

      {label && <span>{label}</span>}
    </button>
  );
}

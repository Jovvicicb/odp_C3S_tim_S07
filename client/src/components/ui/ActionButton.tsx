import { useNavigate } from "react-router-dom";

type ActionType = "create" | "back";

type Size = "sm" | "md" | "lg";

const sizeStyles: Record<Size, string> = {
  sm: "px-2 py-1 text-sm gap-1.5",
  md: "px-3 py-1 text-base gap-2",
  lg: "px-5 py-1 text-lg gap-3",
};

type Props = {
  type: ActionType;
  label?: string;
  to?: string;
  className?: string;
  size?: Size;
};

export function ActionButton({ type, label, to, className = "", size }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === "back") {
      navigate(-1);
      return;
    }
    if (to) {
      navigate(to);
    }
  };

  const config = {
    create: {
      label: label ?? "Create community",
      icon: "+",
      buttonClass:
        "bg-sky-600 border border-sky-400 hover:bg-sky-400 hover:-translate-y-0.5 shadow-lg shadow-sky-600/30",
      textClass: "text-white",
    },
    back: {
      label: label ?? "Back",
      icon: "←",
      buttonClass:
        "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5",
      textClass: "text-white/80",
    },
  }[type];

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center rounded-xl font-semibold transition-all duration-200 active:scale-[0.97] ${sizeStyles[size ?? "md"]} ${config.buttonClass} ${className}`}
    >
      <span
        className={`${config.textClass} ${size === "sm" ? "text-base" : "text-xl"} leading-none`}
      >
        {config.icon}
      </span>
      <span className={`${config.textClass}`}>{config.label}</span>
    </button>
  );
}

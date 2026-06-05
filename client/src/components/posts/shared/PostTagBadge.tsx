import { Badge } from "../../ui/badge/Badge";

type Props = {
  name: string;
  removable?: boolean;
  removing?: boolean;
  onRemove?: () => void;
};

export function PostTagBadge({
  name,
  removable = false,
  removing = false,
  onRemove,
}: Props) {
  return (
    <Badge
      tone="sky"
      className="gap-2 rounded-2xl px-3 py-1.5 transition-all hover:border-sky-300/25 hover:bg-sky-400/15"
    >
      #{name}
      {removable && (
        <button
          type="button"
          disabled={removing}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="rounded-lg px-1.5 py-0.5 text-sky-100/55 transition-all hover:bg-red-500/15 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Remove ${name} tag`}
        >
          {removing ? "..." : "×"}
        </button>
      )}
    </Badge>
  );
}

import type { CommunityDto } from "../../../models/communities/CommunityDto";

type Props = {
  type: CommunityDto["type"];
};

export function CommunityTypeBadge({ type }: Props) {
  const isPublic = type === "public";

  return (
    <span
      className={`rounded-xl border px-2.5 py-1 text-[11px] font-bold capitalize ${
        isPublic
          ? "border-sky-400/15 bg-sky-400/10 text-sky-200/75"
          : "border-amber-400/20 bg-amber-400/10 text-amber-300"
      }`}
    >
      {type}
    </span>
  );
}

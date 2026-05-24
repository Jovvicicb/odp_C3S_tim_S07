import { Badge } from "./Badge";

type Props = {
  count: number;
  singular: string;
  plural: string;
};

export function CountBadge({ count, singular, plural }: Props) {
  return (
    <Badge tone="sky" className="rounded-2xl px-3 py-1.5 font-bold">
      {count} {count === 1 ? singular : plural}
    </Badge>
  );
}

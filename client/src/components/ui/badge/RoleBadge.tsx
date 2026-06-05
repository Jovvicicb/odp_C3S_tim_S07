import { Badge } from "./Badge";

type Props = {
  role: string;
};

export function RoleBadge({ role }: Props) {
  return (
    <Badge tone={role === "admin" ? "amber" : "sky"} className="capitalize">
      {role}
    </Badge>
  );
}

import type { CommunityDto } from "../../../models/communities/CommunityDto";
import { Badge } from "../../ui/badge/Badge";

type Props = {
  type: CommunityDto["type"];
};

export function CommunityTypeBadge({ type }: Props) {
  return (
    <Badge tone={type === "public" ? "sky" : "amber"} className="capitalize">
      {type}
    </Badge>
  );
}

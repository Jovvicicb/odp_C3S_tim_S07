import type { AuditDto } from "../../models/audits/AuditDto";
import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import { CountBadge } from "../ui/CountBadge";
import { SectionCard } from "../ui/SectionCard";
import { AdminAuditTable } from "./AdminAuditTable";

type Props = {
  audits: PaginatedListDto<AuditDto>;
  page: number;
  limit: number;
  loading: boolean;
  onPageChange: (page: number) => void;
};

export function AdminAuditSection({
  audits,
  page,
  limit,
  loading,
  onPageChange,
}: Props) {
  return (
    <SectionCard
      label="Audit logs"
      title="Recorded system activity"
      description="Review administrative actions, user activity and system events recorded by the audit service."
      action={<CountBadge count={audits.total} singular="log" plural="logs" />}
    >
      <AdminAuditTable
        audits={audits}
        page={page}
        limit={limit}
        loading={loading}
        onPageChange={onPageChange}
      />
    </SectionCard>
  );
}

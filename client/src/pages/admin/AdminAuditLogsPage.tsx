import { AdminAuditSection } from "../../components/audits/AdminAuditSection";
import { ErrorBox, PageHeader } from "../../components/ui/UI";
import { ActionButton } from "../../components/ui/button/ActionButton";

import { useAuditLogs } from "../../hooks/audits/useAuditLogs";

export default function AdminAuditLogsPage() {
  const { audits, page, limit, loading, error, setPage } = useAuditLogs(1, 10);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin panel"
        title="Audit logs"
        action={<ActionButton variant="back" label="Back" />}
      />

      {error && <ErrorBox message={error} />}

      <AdminAuditSection
        audits={audits}
        page={page}
        limit={limit}
        loading={loading}
        onPageChange={setPage}
      />
    </div>
  );
}

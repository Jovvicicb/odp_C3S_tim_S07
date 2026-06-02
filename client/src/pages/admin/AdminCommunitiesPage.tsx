import { ErrorBox, PageHeader } from "../../components/ui/UI";
import { AdminCommunitiesSection } from "../../components/admin/communities/AdminCommunitiesSection";

import { useAdminCommunities } from "../../hooks/communities/admin/useAdminCommunities";
import { ActionButton } from "../../components/ui/button/ActionButton";

export default function AdminCommunitiesPage() {
  const { communities, loading, error, page, limit, total, setPage } =
    useAdminCommunities(1, 10);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin panel"
        title="Communities"
        action={<ActionButton variant="back" label="Back" />}
      />

      {error && <ErrorBox message={error} />}

      <AdminCommunitiesSection
        communities={communities}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}

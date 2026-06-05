import { ErrorBox, PageHeader } from "../../components/ui/UI";
import { AdminCommunitiesSection } from "../../components/admin/communities/AdminCommunitiesSection";

import { useAdminCommunities } from "../../hooks/communities/admin/useAdminCommunities";
import { useDeleteAdminCommunity } from "../../hooks/communities/admin/useDeleteAdminCommunity";
import { ActionButton } from "../../components/ui/button/ActionButton";

export default function AdminCommunitiesPage() {
  const {
    communities,
    setCommunities,
    loading,
    error,
    page,
    limit,
    total,
    setPage,
    setTotal,
  } = useAdminCommunities(1, 10);

  const {
    handleDeleteCommunity,
    loadingCommunityId,
    error: deleteError,
  } = useDeleteAdminCommunity({
    communities,
    page,
    setCommunities,
    setTotal,
    setPage,
  });

  const pageError = error || deleteError;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin panel"
        title="Communities"
        action={<ActionButton variant="back" label="Back" />}
      />

      {pageError && <ErrorBox message={pageError} />}

      <AdminCommunitiesSection
        communities={communities}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        loadingCommunityId={loadingCommunityId}
        onPageChange={setPage}
        onDelete={handleDeleteCommunity}
      />
    </div>
  );
}

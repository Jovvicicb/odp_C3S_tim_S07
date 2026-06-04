import { ErrorBox, PageHeader } from "../../components/ui/UI";
import { ActionButton } from "../../components/ui/button/ActionButton";
import { AdminPostsSection } from "../../components/admin/posts/AdminPostsSection";

import { useAdminPosts } from "../../hooks/posts/admin/useAdminPosts";
import { useDeleteAdminPost } from "../../hooks/posts/admin/useDeleteAdminPost";

export default function AdminPostsPage() {
  const {
    posts,
    setPosts,
    loading,
    error,
    page,
    limit,
    total,
    setPage,
    setTotal,
  } = useAdminPosts(1, 10);

  const {
    handleDeletePost,
    loadingPostId,
    error: deleteError,
  } = useDeleteAdminPost({
    posts,
    page,
    setPosts,
    setTotal,
    setPage,
  });

  const pageError = error || deleteError;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin panel"
        title="Posts"
        action={<ActionButton variant="back" label="Back" />}
      />

      {pageError && <ErrorBox message={pageError} />}

      <AdminPostsSection
        posts={posts}
        page={page}
        limit={limit}
        total={total}
        loading={loading}
        loadingPostId={loadingPostId}
        onPageChange={setPage}
        onDelete={handleDeletePost}
      />
    </div>
  );
}

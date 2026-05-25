import { ActionButton } from "../../components/ui/button/ActionButton";
import { ErrorBox, PageHeader } from "../../components/ui/UI";
import { DashboardFeedSection } from "../../components/dashboard/DashboardFeedSection";

import { useAuth } from "../../hooks/auth/useAuthHook";
import { useFeedPosts } from "../../hooks/posts/feed/useFeedPosts";

export default function FeedPage() {
  const { user } = useAuth();

  const { posts, loading, error, page, limit, total, setPage } = useFeedPosts(
    1,
    10,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${user?.username}`}
        action={
          <ActionButton
            variant="create"
            label="Create community"
            to="/communities/create"
          />
        }
      />

      {error && <ErrorBox message={error} />}

      <DashboardFeedSection
        posts={posts}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}

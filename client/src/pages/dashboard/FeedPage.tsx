import { ActionButton } from "../../components/ui/button/ActionButton";
import { ErrorBox, PageHeader } from "../../components/ui/UI";

import { DashboardFeedSection } from "../../components/dashboard/DashboardFeedSection";
import { DashboardStatsGrid } from "../../components/dashboard/DashboardStatsGrid";

import { useAuth } from "../../hooks/auth/useAuthHook";
import { useFeedPosts } from "../../hooks/posts/feed/useFeedPosts";
import { useDashboardStatistics } from "../../hooks/statistics/useDashboardStatistics";

export default function FeedPage() {
  const { user } = useAuth();

  const {
    posts,
    loading: feedLoading,
    error: feedError,
    page,
    limit,
    total,
    setPage,
  } = useFeedPosts(1, 10);

  const {
    statistics,
    loading: statisticsLoading,
    error: statisticsError,
  } = useDashboardStatistics();

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

      {(feedError || statisticsError) && (
        <ErrorBox message={feedError || statisticsError} />
      )}

      <DashboardStatsGrid statistics={statistics} loading={statisticsLoading} />

      <DashboardFeedSection
        posts={posts}
        loading={feedLoading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}

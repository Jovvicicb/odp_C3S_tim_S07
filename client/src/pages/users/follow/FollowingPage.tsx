import { useParams } from "react-router-dom";

import {
  ErrorBox,
  PageHeader,
  Pagination,
  Spinner,
} from "../../../components/ui/UI";
import { CountBadge } from "../../../components/ui/CountBadge";
import { SectionCard } from "../../../components/ui/SectionCard";
import { SectionEmptyState } from "../../../components/ui/SectionEmptyState";

import { FollowingList } from "../../../components/users/follow/FollowingList";

import { useAuth } from "../../../hooks/auth/useAuthHook";
import { useUserFollowList } from "../../../hooks/users/follow/useUserFollowList";
import { useFollowingActions } from "../../../hooks/users/follow/useFollowingActions";
import { ActionButton } from "../../../components/ui/button/ActionButton";

export default function FollowingPage() {
  const { id } = useParams();

  const viewedUserId = Number(id);

  const { user } = useAuth();

  const {
    users,
    setUsers,
    loading,
    error,
    page,
    limit,
    total,
    setPage,
    setTotal,
  } = useUserFollowList(
    Number.isNaN(viewedUserId) ? null : viewedUserId,
    "following",
    1,
    10,
  );

  const isMyFollowingPage = user?.id === viewedUserId;

  const { handleUnfollow, followLoadingUserId, followError } =
    useFollowingActions({
      users,
      page,
      isMyFollowingPage,
      setUsers,
      setTotal,
      setPage,
    });

  const pageError = error || followError;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Users"
        title="Following"
        action={<ActionButton variant="back" label="Back" />}
      />

      {pageError && <ErrorBox message={pageError} />}

      <SectionCard
        label="Following"
        title={isMyFollowingPage ? "People you follow" : "Users being followed"}
        description={
          isMyFollowingPage
            ? "Browse people you follow and unfollow profiles you no longer want in your network."
            : "Browse profiles this user follows and open them to view more details."
        }
        action={
          <CountBadge count={total} singular="following" plural="following" />
        }
      >
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size={24} />
          </div>
        ) : users.length === 0 && !error ? (
          <SectionEmptyState
            title={
              isMyFollowingPage
                ? "You are not following anyone yet."
                : "No followed users yet."
            }
            description={
              isMyFollowingPage
                ? "When you follow people, their profiles will appear here."
                : "This user is not following other profiles yet."
            }
          />
        ) : (
          <>
            <FollowingList
              followingUsers={users}
              followLoadingUserId={followLoadingUserId}
              onUnfollow={handleUnfollow}
            />

            <div className="mt-6">
              <Pagination
                page={page}
                total={total}
                pageSize={limit}
                onChange={setPage}
              />
            </div>
          </>
        )}
      </SectionCard>
    </div>
  );
}

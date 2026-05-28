import { useParams } from "react-router-dom";

import {
  ErrorBox,
  PageHeader,
  Pagination,
  Spinner,
} from "../../../components/ui/UI";
import { CountBadge } from "../../../components/ui/CountBadge";
import { SectionCard } from "../../../components/ui/SectionCard";

import { FollowersList } from "../../../components/users/follow/FollowersList";

import { useAuth } from "../../../hooks/auth/useAuthHook";
import { useUserFollowList } from "../../../hooks/users/follow/useUserFollowList";
import { useFollowersActions } from "../../../hooks/users/follow/useFollowersActions";
import { SectionEmptyState } from "../../../components/ui/SectionEmptyState";
import { ActionButton } from "../../../components/ui/button/ActionButton";

export default function FollowersPage() {
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
    "followers",
    1,
    10,
  );

  const { handleRemoveFollower, removeLoadingUserId, removeError } =
    useFollowersActions({
      users,
      page,
      setUsers,
      setTotal,
      setPage,
    });

  const isMyFollowersPage = user?.id === viewedUserId;
  const pageError = error || removeError;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Users"
        title="Followers"
        action={<ActionButton variant="back" label="Back" />}
      />

      {pageError && <ErrorBox message={pageError} />}

      <SectionCard
        label="Followers"
        title={isMyFollowersPage ? "People following you" : "User followers"}
        description={
          isMyFollowersPage
            ? "Review people who follow your profile and remove followers when needed."
            : "Browse people who follow this user and open their profiles."
        }
        action={
          <CountBadge count={total} singular="follower" plural="followers" />
        }
      >
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size={24} />
          </div>
        ) : users.length === 0 && !error ? (
          <SectionEmptyState
            title="No followers yet."
            description={
              isMyFollowersPage
                ? "When people start following you, they will appear here."
                : "This user does not have followers yet."
            }
          />
        ) : (
          <>
            <FollowersList
              followers={users}
              canRemoveFollowers={isMyFollowersPage}
              removeLoadingUserId={removeLoadingUserId}
              onRemoveFollower={handleRemoveFollower}
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

import { useParams } from "react-router-dom";

import {
  Empty,
  ErrorBox,
  PageHeader,
  Pagination,
  Spinner,
} from "../../components/ui/UI";

import { FollowersList } from "../../components/users/follow/FollowersList";

import { useAuth } from "../../hooks/auth/useAuthHook";
import { useUserFollowList } from "../../hooks/users/useUserFollowList";
import { useFollowersActions } from "../../hooks/users/follow/useFollowersActions";

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

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Users" title="Followers" />

      {(error || removeError) && <ErrorBox message={error || removeError} />}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : users.length === 0 && !error ? (
        <Empty message="No followers found." />
      ) : (
        <>
          <FollowersList
            followers={users}
            canRemoveFollowers={isMyFollowersPage}
            removeLoadingUserId={removeLoadingUserId}
            onRemoveFollower={handleRemoveFollower}
          />

          <Pagination
            page={page}
            total={total}
            pageSize={limit}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}

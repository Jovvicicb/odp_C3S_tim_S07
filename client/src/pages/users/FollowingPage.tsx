import { useParams } from "react-router-dom";

import {
  Empty,
  ErrorBox,
  PageHeader,
  Pagination,
  Spinner,
} from "../../components/ui/UI";

import { FollowingList } from "../../components/user/follow/FollowingList";

import { useAuth } from "../../hooks/auth/useAuthHook";
import { useUserFollowList } from "../../hooks/users/useUserFollowList";
import { useFollowingActions } from "../../hooks/users/follow/useFollowingActions";

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

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Users" title="Following" />

      {(error || followError) && <ErrorBox message={error || followError} />}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : users.length === 0 && !error ? (
        <Empty message="No following users found." />
      ) : (
        <>
          <FollowingList
            followingUsers={users}
            followLoadingUserId={followLoadingUserId}
            onUnfollow={handleUnfollow}
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

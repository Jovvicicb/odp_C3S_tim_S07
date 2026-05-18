import { useParams } from "react-router-dom";
import {
  Empty,
  ErrorBox,
  PageHeader,
  Pagination,
  Spinner,
} from "../../components/ui/UI";
import { UserCard } from "../../components/user/UserCard";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { useToast } from "../../hooks/toast/useToast";
import { useUserFollowList } from "../../hooks/users/useUserFollowList";
import { useRemoveFollower } from "../../hooks/users/useRemoveFollower";

export default function FollowersPage() {
  const { id } = useParams();
  const viewedUserId = Number(id);

  const { user } = useAuth();
  const { showToast } = useToast();

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

  const {
    removeFollower,
    loadingUserId: removeLoadingUserId,
    error: removeError,
  } = useRemoveFollower();

  const isMyFollowersPage = user?.id === viewedUserId;

  const handleRemoveFollower = async (followerId: number) => {
    const message = await removeFollower(followerId);

    if (!message) return;

    setUsers((current) => current.filter((u) => u.id !== followerId));
    setTotal((current) => Math.max(0, current - 1));

    showToast({ type: "success", message });

    if (users.length === 1 && page > 1) {
      setPage(page - 1);
    }
  };

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
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {users.map((follower) => (
              <UserCard
                key={follower.id}
                user={follower}
                showRemoveFollowerAction={isMyFollowersPage}
                removeFollowerLoading={removeLoadingUserId === follower.id}
                onRemoveFollower={handleRemoveFollower}
              />
            ))}
          </div>

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

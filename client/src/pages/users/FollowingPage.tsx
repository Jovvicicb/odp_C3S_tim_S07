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
import { useUserFollow } from "../../hooks/users/useUserFollow";
import { useUserFollowList } from "../../hooks/users/useUserFollowList";

export default function FollowingPage() {
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
    "following",
    1,
    10,
  );

  const {
    unfollow,
    loadingUserId: followLoadingUserId,
    error: followError,
  } = useUserFollow();

  const isMyFollowingPage = user?.id === viewedUserId;

  const handleUnfollow = async (followingId: number) => {
    const message = await unfollow(followingId);
    if (!message) return;

    if (isMyFollowingPage) {
      setUsers((current) => current.filter((u) => u.id !== followingId));
      setTotal((current) => Math.max(0, current - 1));

      if (users.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } else {
      setUsers((current) =>
        current.map((u) =>
          u.id === followingId ? { ...u, followStatus: "not_following" } : u,
        ),
      );
    }

    showToast({ type: "success", message });
  };

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
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {users.map((following) => (
              <UserCard
                key={following.id}
                user={{
                  ...following,
                  followStatus: "following",
                }}
                showFollowAction
                followLoading={followLoadingUserId === following.id}
                onUnfollow={handleUnfollow}
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

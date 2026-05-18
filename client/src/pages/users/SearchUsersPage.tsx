import {
  Empty,
  ErrorBox,
  PageHeader,
  Pagination,
  Spinner,
} from "../../components/ui/UI";
import { UserCard } from "../../components/user/UserCard";
import { useSearchUsers } from "../../hooks/users/useSearchUsers";
import { useUserFollow } from "../../hooks/users/useUserFollow";
import { useToast } from "../../hooks/toast/useToast";

export default function SearchUsersPage() {
  const {
    users,
    setUsers,
    loading,
    error,
    username,
    page,
    limit,
    total,
    setUsername,
    setPage,
  } = useSearchUsers(1, 10);

  const {
    follow,
    unfollow,
    loadingUserId,
    error: followError,
  } = useUserFollow();

  const { showToast } = useToast();

  const handleSearchChange = (value: string) => {
    setUsername(value);
    setPage(1);
  };

  const handleFollow = async (userId: number) => {
    const message = await follow(userId);

    if (!message) return;

    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? {
              ...user,
              followStatus: "following",
            }
          : user,
      ),
    );

    showToast({
      type: "success",
      message,
    });
  };

  const handleUnfollow = async (userId: number) => {
    const message = await unfollow(userId);

    if (!message) return;

    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? {
              ...user,
              followStatus: "not_following",
            }
          : user,
      ),
    );

    showToast({
      type: "success",
      message,
    });
  };

  const hasSearch = username.trim().length > 0;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Users" title="Search users" />

      <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-4 shadow-xl shadow-sky-950/10">
        <label
          htmlFor="user-search"
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-white/25"
        >
          Username
        </label>

        <input
          id="user-search"
          name="user-search"
          type="text"
          value={username}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by username..."
          className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6"
        />
      </div>

      {(error || followError) && <ErrorBox message={error || followError} />}

      {!hasSearch ? (
        <Empty message="Start typing a username to search users." />
      ) : loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : users.length === 0 && !error ? (
        <Empty message="No users found." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                showFollowAction
                followLoading={loadingUserId === user.id}
                onFollow={handleFollow}
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

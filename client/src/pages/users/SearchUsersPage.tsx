import {
  Empty,
  ErrorBox,
  PageHeader,
  Pagination,
  Spinner,
} from "../../components/ui/UI";

import { SearchUsersToolbar } from "../../components/users/search/SearchUsersToolbar";
import { SearchUsersList } from "../../components/users/search/SearchUsersList";

import { useSearchUsers } from "../../hooks/users/useSearchUsers";
import { useSearchUsersActions } from "../../hooks/users/search/useSearchUsersActions";

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

  const { handleFollow, handleUnfollow, loadingUserId, followError } =
    useSearchUsersActions({
      setUsers,
    });

  const handleSearchChange = (value: string) => {
    setUsername(value);
    setPage(1);
  };

  const hasSearch = username.trim().length > 0;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Users" title="Search users" />

      <SearchUsersToolbar
        username={username}
        onUsernameChange={handleSearchChange}
      />

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
          <SearchUsersList
            users={users}
            loadingUserId={loadingUserId}
            onFollow={handleFollow}
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

import {
  ErrorBox,
  PageHeader,
  Pagination,
  Spinner,
} from "../../../components/ui/UI";
import { CountBadge } from "../../../components/ui/CountBadge";
import { SectionCard } from "../../../components/ui/SectionCard";

import { SearchUsersToolbar } from "../../../components/users/search/SearchUsersToolbar";
import { SearchUsersList } from "../../../components/users/search/SearchUsersList";

import { useSearchUsers } from "../../../hooks/users/search/useSearchUsers";
import { useSearchUsersActions } from "../../../hooks/users/search/useSearchUsersActions";
import { SectionEmptyState } from "../../../components/ui/SectionEmptyState";

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
  const pageError = error || followError;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Users" title="Search users" />

      <SearchUsersToolbar
        username={username}
        onUsernameChange={handleSearchChange}
      />

      {pageError && <ErrorBox message={pageError} />}

      <SectionCard
        label="Results"
        title="Matching users"
        description={
          hasSearch
            ? "Browse matching profiles and follow users directly from the search results."
            : "Start typing a username above to search for people on PulseNet."
        }
        action={
          <CountBadge
            count={hasSearch ? total : 0}
            singular="user"
            plural="users"
          />
        }
      >
        {!hasSearch ? (
          <SectionEmptyState
            title="Search has not started yet."
            description="Start typing a username above and matching users will appear here."
          />
        ) : loading ? (
          <div className="flex justify-center py-16">
            <Spinner size={24} />
          </div>
        ) : users.length === 0 && !error ? (
          <SectionEmptyState
            title="No users found."
            description="Try a different username or check if the search text is spelled correctly."
          />
        ) : (
          <>
            <SearchUsersList
              users={users}
              loadingUserId={loadingUserId}
              onFollow={handleFollow}
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

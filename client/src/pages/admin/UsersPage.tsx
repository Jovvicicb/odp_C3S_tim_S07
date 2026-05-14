import {
  Empty,
  ErrorBox,
  PageHeader,
  Pagination,
  Spinner,
} from "../../components/ui/UI";
import { UserCard } from "../../components/user/UserCard";
import { useUsers } from "../../hooks/users/useUsers";
import { useUpdateUserRole } from "../../hooks/users/useUpdateUserRole";
import { useToast } from "../../hooks/toast/useToast";
import { UserMessages } from "../../constants/messages/user/UserMessages";
import type { UserRole } from "../../types/user/UserRole";

export default function UsersPage() {
  const {
    users,
    setUsers,
    loading,
    error,
    page,
    limit,
    total,
    setPage,
    reload,
  } = useUsers(1, 10);

  const { updateRole, loadingUserId, error: updateError } = useUpdateUserRole();

  const { showToast } = useToast();

  const handleRoleChange = async (userId: number, role: UserRole) => {
    try {
      const updated = await updateRole(userId, role);

      if (!updated) return;

      setUsers((current) =>
        current.map((user) =>
          user.id === userId
            ? {
                ...user,
                role,
              }
            : user,
        ),
      );

      showToast({
        type: "success",
        message: UserMessages.roleUpdated,
      });

      void reload();
    } catch {
      showToast({
        type: "error",
        message: UserMessages.roleUpdateFailed,
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin panel" title="Users" />

      {(error || updateError) && <ErrorBox message={error || updateError} />}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : users.length === 0 && !error ? (
        <Empty message="No users found" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                loading={loadingUserId === user.id}
                onRoleChange={handleRoleChange}
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

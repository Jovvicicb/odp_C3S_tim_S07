import { ErrorBox, PageHeader } from "../../components/ui/UI";
import { AdminUsersSection } from "../../components/admin/users/AdminUsersSection";

import { useToast } from "../../hooks/toast/useToast";
import { useUsers } from "../../hooks/users/core/useUsers";
import { useUpdateUserRole } from "../../hooks/users/settings/useUpdateUserRole";

import { UserMessages } from "../../constants/messages/user/UserMessages";

import type { UserRole } from "../../types/users/UserRole";
import { ActionButton } from "../../components/ui/button/ActionButton";

export default function AdminUsersPage() {
  const { users, setUsers, loading, error, page, limit, total, setPage } =
    useUsers(1, 10);

  const { updateRole, loadingUserId, error: updateError } = useUpdateUserRole();

  const { showToast } = useToast();

  const handleRoleChange = async (userId: number, role: UserRole) => {
    try {
      const updated = await updateRole(userId, role);

      if (!updated) {
        return;
      }

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
    } catch {
      showToast({
        type: "error",
        message: UserMessages.roleUpdateFailed,
      });
    }
  };
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin panel"
        title="Users"
        action={<ActionButton variant="back" label="Back" />}
      />

      {(error || updateError) && <ErrorBox message={error || updateError} />}

      <AdminUsersSection
        users={users}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        loadingUserId={loadingUserId}
        onPageChange={setPage}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
}

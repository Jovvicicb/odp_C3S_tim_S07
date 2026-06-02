import type { UserDto } from "../../../models/users/UserDto";
import type { UserRole } from "../../../types/users/UserRole";

import { CountBadge } from "../../ui/CountBadge";
import { Pagination, Spinner } from "../../ui/UI";
import { SectionCard } from "../../ui/SectionCard";
import { SectionEmptyState } from "../../ui/SectionEmptyState";
import { UserCard } from "../../users/card/UserCard";

type Props = {
  users: UserDto[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  loadingUserId: number | null;
  onPageChange: (page: number) => void;
  onRoleChange: (userId: number, role: UserRole) => void;
};

export function AdminUsersSection({
  users,
  loading,
  page,
  limit,
  total,
  loadingUserId,
  onPageChange,
  onRoleChange,
}: Props) {
  return (
    <SectionCard
      label="User management"
      title="Registered users"
      description="Review platform accounts and update user roles when administrative changes are needed."
      action={<CountBadge count={total} singular="user" plural="users" />}
    >
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={24} />
        </div>
      ) : users.length === 0 ? (
        <SectionEmptyState
          title="No users found."
          description="Registered users will appear here after accounts are created."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                showRoleControl
                roleLoading={loadingUserId === user.id}
                onRoleChange={onRoleChange}
              />
            ))}
          </div>

          <div className="mt-6 border-t border-white/8 pt-5">
            <Pagination
              page={page}
              total={total}
              pageSize={limit}
              onChange={onPageChange}
            />
          </div>
        </>
      )}
    </SectionCard>
  );
}

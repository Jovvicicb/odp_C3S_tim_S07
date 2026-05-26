import type { UserRole } from "../../../types/users/UserRole";

type Props = {
  userId: number;
  role: UserRole;
  loading?: boolean;
  onRoleChange?: (userId: number, role: UserRole) => void;
};

export function UserRoleSelect({
  userId,
  role,
  loading = false,
  onRoleChange,
}: Props) {
  return (
    <select
      value={role}
      disabled={loading}
      onChange={(e) => onRoleChange?.(userId, e.target.value as UserRole)}
      className="rounded-2xl border border-white/10 bg-[#07111f] px-3 py-2 text-xs font-semibold text-white/80 outline-none transition-all hover:border-sky-300/30 focus:border-sky-300/40 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="user" className="bg-[#07111f] text-white">
        user
      </option>

      <option value="admin" className="bg-[#07111f] text-white">
        admin
      </option>
    </select>
  );
}

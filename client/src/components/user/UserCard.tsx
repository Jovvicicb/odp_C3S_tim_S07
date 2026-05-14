import { useNavigate } from "react-router-dom";
import type { UserDto } from "../../models/user/UserDto";
import type { UserRole } from "../../types/user/UserRole";
import { ImageHelper } from "../../helpers/images/ImageHelper";
import { RoleBadge } from "../ui/UI";

type Props = {
  user: UserDto;
  loading?: boolean;
  onRoleChange: (userId: number, role: UserRole) => void;
};

export function UserCard({ user, loading = false, onRoleChange }: Props) {
  const navigate = useNavigate();

  const imageUrl = ImageHelper.getImageUrl(user.image);
  const initial = user.username[0]?.toUpperCase() ?? "U";

  return (
    <article
      onClick={() => navigate(`/users/${user.id}`)}
      className="group h-full cursor-pointer rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-5 shadow-xl shadow-sky-950/10 transition-all hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-[#0e1520]/90"
    >
      <div className="flex items-center gap-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={user.username}
            className="h-14 w-14 rounded-2xl border border-white/10 object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/10">
            <span className="text-lg font-bold text-sky-200">{initial}</span>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="truncate text-base font-semibold text-white">
              {user.username}
            </h2>

            <RoleBadge role={user.role} />
          </div>

          <p className="mt-1 truncate text-sm text-white/40">{user.email}</p>

          {user.fullname && (
            <p className="mt-1 truncate text-xs text-white/30">
              {user.fullname}
            </p>
          )}
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          className="flex shrink-0 items-center gap-3"
        >
          <select
            value={user.role}
            disabled={loading}
            onChange={(e) => onRoleChange(user.id, e.target.value as UserRole)}
            className="rounded-2xl border border-white/10 bg-[#07111f] px-3 py-2 text-xs font-semibold text-white/80 outline-none transition-all hover:border-sky-300/30 focus:border-sky-300/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="user" className="bg-[#07111f] text-white">
              user
            </option>
            <option value="admin" className="bg-[#07111f] text-white">
              admin
            </option>
          </select>

          <span className="text-white/25 transition-colors group-hover:text-sky-200">
            →
          </span>
        </div>
      </div>
    </article>
  );
}

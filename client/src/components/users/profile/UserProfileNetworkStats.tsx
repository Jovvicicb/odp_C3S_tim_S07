import { useNavigate } from "react-router-dom";

type Props = {
  userId: number;
  followersCount: number;
  followingCount: number;
  isOwnProfile: boolean;
  isAuthenticated: boolean;
};

type NetworkStatCardProps = {
  label: string;
  value: number;
  description: string;
  to: string;
  clickable: boolean;
};

function NetworkStatCard({
  label,
  value,
  description,
  to,
  clickable,
}: NetworkStatCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={() => clickable && navigate(to)}
      className={`group relative min-w-36 overflow-hidden rounded-2xl border border-white/8 bg-white/3 px-4 py-3 text-left transition-all ${
        clickable
          ? "hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-sky-400/8"
          : "cursor-default"
      }`}
    >
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-sky-400/6 blur-2xl transition-all group-hover:bg-sky-400/12" />

      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-200/35">
          {label}
        </p>

        <p className="mt-2 text-2xl font-black tracking-tight text-emerald-300">
          {value}
        </p>

        <p className="mt-1 text-xs leading-5 text-white/30 transition-colors group-hover:text-white/45">
          {description}
        </p>
      </div>
    </button>
  );
}

export function UserProfileNetworkStats({
  userId,
  followersCount,
  followingCount,
  isOwnProfile,
  isAuthenticated,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-80">
      <NetworkStatCard
        label="Followers"
        value={followersCount}
        description={
          isOwnProfile ? "People following you" : "People following this user"
        }
        to={`/users/${userId}/followers`}
        clickable={isAuthenticated}
      />

      <NetworkStatCard
        label="Following"
        value={followingCount}
        description={
          isOwnProfile ? "People you follow" : "People this user follows"
        }
        to={`/users/${userId}/following`}
        clickable={isAuthenticated}
      />
    </div>
  );
}

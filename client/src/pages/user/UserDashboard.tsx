import { ActionButton } from "../../components/ui/ActionButton";
import { PageHeader, StatCard } from "../../components/ui/UI";
import { useAuth } from "../../hooks/auth/useAuthHook";

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back, ${user?.username}`}
        action={
          <ActionButton
            variant="create"
            label="Create community"
            to="/communities/create"
          />
        }
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Communities" value="12" sub="Joined communities" />

        <StatCard label="Posts" value="48" sub="Published posts" />

        <StatCard label="Followers" value="230" sub="People following you" />

        <StatCard
          label="Activity"
          value="Active"
          sub="Your account status"
          color="text-emerald-300"
        />
      </div>

      <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Your feed
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/40">
          Follow communities and users to personalize your dashboard feed.
          Recent posts and discussions from your network will appear here.
        </p>
      </div>
    </div>
  );
}

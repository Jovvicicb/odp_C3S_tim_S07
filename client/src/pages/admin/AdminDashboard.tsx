import { PageHeader, StatCard } from "../../components/ui/UI";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin panel" title="Dashboard" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value="124" sub="Registered accounts" />

        <StatCard label="Communities" value="32" sub="Active communities" />

        <StatCard label="Posts" value="1,248" sub="Published posts" />

        <StatCard
          label="System"
          value="Healthy"
          sub="All replication nodes online"
          color="text-emerald-300"
        />
      </div>

      <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
        <p className="text-lg font-semibold text-white">
          Welcome to PulseNet administration
        </p>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/40">
          Manage users, communities, posts and monitor the state of the
          distributed system infrastructure.
        </p>
      </div>
    </div>
  );
}

import { type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { RoleBadge } from "../ui/UI";
import { useToast } from "../../hooks/toast/useToast";

const userNav = [
  { to: "/feed", label: "My feed", icon: "◈" },
  { to: "/profile", label: "My profile", icon: "◉" },
];

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: "◈" },
  { to: "/feed", label: "My feed", icon: "⬡" },
  { to: "/admin/users", label: "Users", icon: "◎" },
  { to: "/admin/communities", label: "Communities", icon: "⬡" },
  { to: "/profile", label: "My profile", icon: "◉" },
];

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const nav = user?.role === "admin" ? adminNav : userNav;
  const initial = user?.username?.[0]?.toUpperCase() ?? "P";

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#07111f]">
      <div className="pointer-events-none absolute top-[-12%] left-[-8%] h-105420px] rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] h-115 w-115 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_35%)]" />

      <aside className="relative z-10 m-4 mr-0 flex w-64 shrink-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f17]/90 shadow-2xl shadow-sky-950/20">
        <div className="flex h-20 items-center justify-between border-b border-white/5 px-5">
          <img
            src="/pulsenet-logo6.png"
            alt="PulseNet"
            className="w-37.5 select-none"
            draggable={false}
          />

          <RoleBadge role={user?.role ?? "user"} />
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-3 py-5">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "border-sky-300/20 bg-sky-400/10 text-sky-100 shadow-lg shadow-sky-950/20"
                    : "border-transparent text-white/35 hover:border-white/10 hover:bg-white/5 hover:text-white/75"
                }`
              }
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/8 bg-white/4 text-sm text-sky-200/70 transition-colors group-hover:text-sky-200">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/8 p-4">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/10">
                <span className="text-sm font-bold text-sky-200">
                  {initial}
                </span>
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white/85">
                  {user?.username}
                </p>
                <p className="text-xs capitalize text-white/30">{user?.role}</p>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                showToast({
                  type: "info",
                  message: "You have been signed out",
                });
                navigate("/login");
              }}
              className="w-full rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-left text-xs font-medium text-white/40 transition-all hover:border-red-400/20 hover:bg-red-500/10 hover:text-red-200"
            >
              Sign out →
            </button>
          </div>
        </div>
      </aside>

      <main className="relative z-10 flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}

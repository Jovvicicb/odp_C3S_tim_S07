import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { RoleBadge } from "../ui/UI";
import { useToast } from "../../hooks/toast/useToast";
import { SidebarGroup } from "./SidebarGroup";

type SidebarLinkProps = {
  to: string;
  label: string;
  onClick?: () => void;
};

export function SidebarLink({ to, label, onClick }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-sky-400/10 text-sky-100 shadow-[0_0_24px_rgba(56,189,248,0.08)] ring-1 ring-sky-300/15"
            : "text-white/55 hover:bg-white/[0.04] hover:text-white"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggleGroup = (group: string) => {
    setOpenGroup((current) => (current === group ? null : group));
  };

  const closeGroups = () => {
    setOpenGroup(null);
  };

  const communityItems = [
    { to: "/communities", label: "Discover" },
    { to: "/communities/mine", label: "My communities" },
  ];

  const userItems = user
    ? [
        { to: "/users/search", label: "Search users" },
        { to: `/users/${user.id}/followers`, label: "Followers" },
        { to: `/users/${user.id}/following`, label: "Following" },
      ]
    : [];
  const adminItems = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/communities", label: "Communities" },
  ];

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

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          <SidebarLink to="/feed" label="Dashboard" onClick={closeGroups} />

          <SidebarGroup
            title="Communities"
            items={communityItems}
            open={openGroup === "Communities"}
            onToggle={() => toggleGroup("Communities")}
            onNavigate={closeGroups}
          />

          {user && (
            <SidebarGroup
              title="Users"
              items={userItems}
              open={openGroup === "Users"}
              onToggle={() => toggleGroup("Users")}
              onNavigate={closeGroups}
            />
          )}

          {user?.role === "admin" && (
            <SidebarGroup
              title="Admin"
              items={adminItems}
              open={openGroup === "Admin"}
              onToggle={() => toggleGroup("Admin")}
              onNavigate={closeGroups}
            />
          )}
        </nav>

        <div className="border-t border-white/8 p-4">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
            <button
              type="button"
              onClick={() => {
                closeGroups();
                navigate("/me");
              }}
              className="mb-3 flex w-full items-center gap-3 rounded-2xl p-1 text-left transition-all hover:bg-white/[0.04]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/10">
                <span className="text-sm font-bold text-sky-200">
                  {initial}
                </span>
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white/85">
                  {user?.username}
                </p>
                <p
                  className={`text-xs font-medium capitalize ${
                    user?.role === "admin"
                      ? "text-amber-300/80"
                      : "text-sky-200/60"
                  }`}
                >
                  {user?.role}
                </p>{" "}
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-white/25 transition-all group-hover:border-sky-300/20 group-hover:bg-sky-400/10 group-hover:text-sky-200">
                <span className="text-sm leading-none">↗</span>
              </div>
            </button>

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

import { useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/auth/useAuthHook";

import { RoleBadge } from "../ui/RoleBadge";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarMyCommunitiesPreview } from "./SidebarMyCommunitiesPreview";

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
            : "text-white/55 hover:bg-white/4 hover:text-white"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggleGroup = (group: string) => {
    setOpenGroup((current) => (current === group ? null : group));
  };

  const closeGroups = () => {
    setOpenGroup(null);
  };

  const communityItems = [{ to: "/communities", label: "Discover" }];

  const communitiesGroupOpen =
    openGroup === "Communities" || location.pathname.startsWith("/communities");

  const userItems = [{ to: "/users/search", label: "Search users" }];

  const adminItems = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/communities", label: "Communities" },
    { to: "/admin/tags", label: "Tags" },
    { to: "/admin/health", label: "Health" },
  ];

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#07111f]">
      <div className="pointer-events-none absolute left-[-8%] top-[-12%] h-105 w-105 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] h-115 w-115 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_35%)]" />

      <aside className="sticky top-4 z-10 m-4 mr-0 flex h-[calc(100vh-2rem)] w-64 shrink-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f17]/90 shadow-2xl shadow-sky-950/20">
        <div className="flex h-20 items-center justify-between border-b border-white/5 px-5">
          <img
            src="/pulsenet-logo6.png"
            alt="PulseNet"
            className="w-37.5 select-none"
            draggable={false}
          />

          {user ? (
            <RoleBadge role={user.role} />
          ) : (
            <span className="rounded-xl border border-white/8 bg-white/4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
              Guest
            </span>
          )}
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          {user ? (
            <>
              <SidebarLink to="/feed" label="Dashboard" onClick={closeGroups} />

              <SidebarGroup
                title="Communities"
                items={communityItems}
                open={communitiesGroupOpen}
                onToggle={() => toggleGroup("Communities")}
                onNavigate={closeGroups}
              />

              <SidebarMyCommunitiesPreview
                visible={communitiesGroupOpen}
                onNavigate={closeGroups}
              />

              <SidebarGroup
                title="Users"
                items={userItems}
                open={openGroup === "Users"}
                onToggle={() => toggleGroup("Users")}
                onNavigate={closeGroups}
              />
            </>
          ) : (
            <SidebarLink to="/" label="Home" onClick={closeGroups} />
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

        <SidebarFooter onNavigate={closeGroups} />
      </aside>

      <main className="relative z-10 h-screen flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}

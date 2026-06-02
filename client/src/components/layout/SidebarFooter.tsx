import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/auth/useAuthHook";
import { useToast } from "../../hooks/toast/useToast";

type Props = {
  onNavigate: () => void;
};

export function SidebarFooter({ onNavigate }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const initial = user?.username?.[0]?.toUpperCase() ?? "P";

  return (
    <div className="border-t border-white/8 p-4">
      <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
        {user ? (
          <>
            <button
              type="button"
              onClick={() => {
                onNavigate();
                navigate(`/users/${user.id}`);
              }}
              className="mb-3 flex w-full items-center gap-3 rounded-2xl p-1 text-left transition-all hover:bg-white/4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/10">
                <span className="text-sm font-bold text-sky-200">
                  {initial}
                </span>
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white/85">
                  {user.username}
                </p>

                <p
                  className={`text-xs font-medium capitalize ${
                    user.role === "admin"
                      ? "text-amber-300/80"
                      : "text-sky-200/60"
                  }`}
                >
                  {user.role}
                </p>
              </div>

              <div className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-white/25 transition-all hover:border-sky-300/20 hover:bg-sky-400/10 hover:text-sky-200">
                <span className="text-sm leading-none">↗</span>
              </div>
            </button>

            <button
              type="button"
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
          </>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                onNavigate();
                navigate("/login");
              }}
              className="w-full rounded-xl border border-sky-300/15 bg-sky-400/10 px-3 py-2 text-left text-xs font-bold text-sky-100/70 transition-all hover:border-sky-300/25 hover:bg-sky-400/15 hover:text-sky-100"
            >
              Sign in →
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigate();
                navigate("/register");
              }}
              className="w-full rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-left text-xs font-medium text-white/45 transition-all hover:border-white/15 hover:bg-white/8 hover:text-white/75"
            >
              Create account →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

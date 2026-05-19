import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";

export default function NotFoundPage() {
  const { isAuthenticated, user } = useAuth();

  const homePath = !isAuthenticated
    ? "/login"
    : user?.role === "admin"
      ? "/admin"
      : "/feed";

  const homeLabel = !isAuthenticated ? "Sign in" : "Go to dashboard";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07111f] px-6">
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-105 w-105 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-105 w-105 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_35%)]" />

      <section className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0b0f17]/90 p-10 text-center shadow-2xl shadow-sky-950/30">
        <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10">
          <img
            src="/pulsenet-logo6.png"
            alt="PulseNet"
            className="mx-auto mb-8 w-[320px] select-none"
            draggable={false}
          />

          <p className="mb-2 text-8xl font-bold tracking-tight text-white/6">
            404
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Page not found
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/40">
            The page you are looking for doesn&apos;t exist or may have been
            moved to a different location.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to={homePath}
              className="w-full rounded-2xl bg-sky-400 px-6 py-3 text-center text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition-all hover:-translate-y-0.5 hover:bg-sky-300 sm:w-auto"
            >
              {homeLabel}
            </Link>

            {isAuthenticated && (
              <Link
                to="/communities"
                className="w-full rounded-2xl border border-white/10 bg-white/4 px-6 py-3 text-center text-sm font-semibold text-white/70 transition-all hover:border-white/20 hover:bg-white/8 hover:text-white sm:w-auto"
              >
                Explore communities
              </Link>
            )}

            {!isAuthenticated && (
              <Link
                to="/register"
                className="w-full rounded-2xl border border-white/10 bg-white/4 px-6 py-3 text-center text-sm font-semibold text-white/70 transition-all hover:border-white/20 hover:bg-white/8 hover:text-white sm:w-auto"
              >
                Create account
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

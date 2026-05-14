import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-6">
      {/* Glow */}
      <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-[#0b0f17]/80 p-10 text-center shadow-2xl shadow-sky-950/20">
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
          The page you are looking for doesn’t exist or may have been moved to a
          different location.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to="/"
            className="rounded-2xl bg-sky-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition-all hover:-translate-y-0.5 hover:bg-sky-300"
          >
            Go home
          </Link>

          <Link
            to="/login"
            className="rounded-2xl border border-white/10 bg-white/4 px-6 py-3 text-sm font-semibold text-white/70 transition-all hover:border-white/20 hover:bg-white/8 hover:text-white"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

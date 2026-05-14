import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="mb-12 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0b0f17]/80 px-8 py-12 shadow-2xl shadow-sky-950/20 md:px-12">
      <div className="relative">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-28 left-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <img
            src="/pulsenet-logo6.png"
            alt="PulseNet"
            className="mb-5 w-137.5 max-w-full select-none"
            draggable={false}
          />

          <h1 className="max-w-3xl text-2xl font-semibold tracking-tight text-white md:text-4xl">
            Discover communities, connect with people and follow the pulse of
            the network.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45 md:text-base">
            Explore public communities and discussions as a guest. Create your
            account to publish posts, interact with other users and build your
            own network inside PulseNet.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="rounded-2xl bg-sky-400 px-7 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition-all hover:-translate-y-0.5 hover:bg-sky-300"
            >
              Create account
            </Link>

            <Link
              to="/login"
              className="rounded-2xl border border-white/10 bg-white/4 px-7 py-3 text-sm font-semibold text-white/70 transition-all hover:border-white/20 hover:bg-white/8 hover:text-white"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

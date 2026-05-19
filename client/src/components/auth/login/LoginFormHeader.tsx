import { useNavigate } from "react-router-dom";

export function LoginFormHeader() {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-4">
        <img
          src="/pulsenet-logo6.png"
          alt="PulseNet"
          className="w-55 select-none"
          draggable={false}
        />

        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-xl border border-white/10 bg-white/4 px-4 py-2 text-sm font-medium text-white/60 transition-all hover:border-white/20 hover:bg-white/8 hover:text-white"
        >
          Back
        </button>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-white">
        Welcome back
      </h1>

      <p className="mt-2 text-sm text-white/40">
        Sign in and continue exploring communities.
      </p>
    </div>
  );
}

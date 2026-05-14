import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";
import { validateLogin } from "../../validators/auth/validateLogin";
import { StringNormalizer } from "../../helpers/normalization/StringNormalizer";
import { AuthMessages } from "../../constants/messages/auth/AuthMessages";
import { CommonMessages } from "../../constants/messages/common/CommonMessages";
import { useNavigate } from "react-router-dom";

export function LoginForm({ authApi }: { authApi: IAuthAPIService }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const validation = validateLogin({ username, password });

    if (!validation.valid) {
      setError(validation.message);
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.login(
        StringNormalizer.normalizeSpaces(username),
        password,
      );

      if (!res.success || !res.data) {
        setError(res.message ?? AuthMessages.loginFailed);
        return;
      }

      login(res.data);
    } catch {
      setError(CommonMessages.unexpectedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f17]/90 shadow-2xl shadow-sky-950/30">
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative p-8">
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

            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Sign in and continue exploring communities.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={40}
                className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
                placeholder="your-username"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
                placeholder="Min 8 chars, 1 uppercase, 1 number"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-2xl bg-sky-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition-all hover:-translate-y-0.5 hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                  Signing in...
                </div>
              ) : (
                "Sign in to PulseNet"
              )}
            </button>
          </form>

          <div className="mt-7 rounded-2xl border border-white/8 bg-white/3 px-4 py-4">
            <p className="text-center text-sm text-white/35">
              New to PulseNet?{" "}
              <a
                href="/register"
                className="font-medium text-sky-300 transition-colors hover:text-sky-200"
              >
                Create your account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

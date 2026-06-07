import { useState } from "react";

import { useAuth } from "../../../hooks/auth/useAuthHook";
import type { IAuthAPIService } from "../../../api_services/auth/IAuthAPIService";
import { validateLogin } from "../../../validators/auth/ValidateLogin";
import { StringNormalizer } from "../../../helpers/normalization/StringNormalizer";
import { AuthMessages } from "../../../constants/messages/auth/AuthMessages";
import { CommonMessages } from "../../../constants/messages/common/CommonMessages";

import { LoginFormHeader } from "./LoginFormHeader";
import { AuthRedirectBox } from "../AuthRedirectBox";
import { SubmitButton } from "../../ui/button/SubmitButton";

export function LoginForm({ authApi }: { authApi: IAuthAPIService }) {
  const { login } = useAuth();

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
        StringNormalizer.trim(username),
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
        <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative p-8">
          <LoginFormHeader />

          {error && (
            <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
            <div>
              <label
                htmlFor="login-username"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35"
              >
                Username
              </label>

              <input
                id="login-username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={40}
                autoComplete="username"
                className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
                placeholder="your-username"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35"
              >
                Password
              </label>

              <input
                id="login-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="current-password"
                className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
                placeholder="Min 8 chars, 1 uppercase, 1 number"
              />
            </div>

            <SubmitButton
              label="Sign in to PulseNet"
              loadingLabel="Signing in..."
              loading={loading}
            />
          </form>

          <AuthRedirectBox
            text="New to PulseNet?"
            linkText="Create your account"
            to="/register"
          />
        </div>
      </div>
    </div>
  );
}

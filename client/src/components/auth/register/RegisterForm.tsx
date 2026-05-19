import { useState } from "react";

import { useAuth } from "../../../hooks/auth/useAuthHook";
import type { IAuthAPIService } from "../../../api_services/auth/IAuthAPIService";
import { validateRegister } from "../../../validators/auth/validateRegister";
import { StringNormalizer } from "../../../helpers/normalization/StringNormalizer";
import { AuthMessages } from "../../../constants/messages/auth/AuthMessages";
import { CommonMessages } from "../../../constants/messages/common/CommonMessages";

import { RegisterFormHeader } from "./RegisterFormHeader";
import { RegisterProfileImageInput } from "./RegisterProfileImageInput";
import { AuthRedirectBox } from "../AuthRedirectBox";
import { useRegisterImageInput } from "../../../hooks/auth/register/useRegisterImageInput";
import { SubmitButton } from "../../ui/SubmitButton";

export function RegisterForm({ authApi }: { authApi: IAuthAPIService }) {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { imageFile, preview, fileKey, handleImageChange } =
    useRegisterImageInput(setError);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const validation = validateRegister({
      username,
      fullname,
      email,
      password,
      bio,
      imageFile,
    });

    if (!validation.valid) {
      setError(validation.message);
      setLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append("username", StringNormalizer.trim(username));
    formData.append("email", StringNormalizer.normalizeEmail(email));
    formData.append("password", password);
    formData.append("fullname", StringNormalizer.normalizeSpaces(fullname));
    formData.append("bio", StringNormalizer.trim(bio));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await authApi.register(formData);

      if (!res.success || !res.data) {
        setError(res.message ?? AuthMessages.registerFailed);
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
    <div className="w-full max-w-lg">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f17]/90 shadow-2xl shadow-sky-950/30">
        <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative p-8">
          <RegisterFormHeader />

          {error && (
            <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="register-username"
                  className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35"
                >
                  Username
                </label>

                <input
                  id="register-username"
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
                  htmlFor="register-fullname"
                  className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35"
                >
                  Full name
                </label>

                <input
                  id="register-fullname"
                  name="fullname"
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={100}
                  autoComplete="name"
                  className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
                  placeholder="your full name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35"
              >
                Email
              </label>

              <input
                id="register-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                required
                autoComplete="email"
                className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35"
              >
                Password
              </label>

              <input
                id="register-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
                placeholder="Min 8 chars, 1 uppercase, 1 number"
              />
            </div>

            <div>
              <label
                htmlFor="register-bio"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35"
              >
                Bio
              </label>

              <input
                id="register-bio"
                name="bio"
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={300}
                className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
                placeholder="Tell people something about you"
              />
            </div>

            <RegisterProfileImageInput
              fileKey={fileKey}
              preview={preview}
              onChange={handleImageChange}
            />

            <SubmitButton
              label="Create PulseNet account"
              loadingLabel="Creating account..."
              loading={loading}
            />
          </form>

          <AuthRedirectBox
            text="Already have an account?"
            linkText="Sign in"
            to="/login"
          />
        </div>
      </div>
    </div>
  );
}

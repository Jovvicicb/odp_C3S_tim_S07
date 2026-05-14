import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";
import { validateRegister } from "../../validators/auth/validateRegister";
import { StringNormalizer } from "../../helpers/normalization/StringNormalizer";
import { AuthMessages } from "../../constants/messages/auth/AuthMessages";
import { CommonMessages } from "../../constants/messages/common/CommonMessages";
import { useNavigate } from "react-router-dom";

export function RegisterForm({ authApi }: { authApi: IAuthAPIService }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileKey, setFileKey] = useState(0);

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
              Create your account
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Build your profile and start joining communities.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Full name
                </label>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={100}
                  className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
                  placeholder="your full name"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
                placeholder="you@example.com"
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

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35">
                Bio
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={300}
                className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
                placeholder="Tell people something about you"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35">
                Profile image
              </label>

              <input
                key={fileKey}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    setImageFile(null);
                    setPreview("");
                    return;
                  }

                  const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                  ];
                  if (!allowedTypes.includes(file.type)) {
                    setError("Only JPG, PNG or WEBP images are allowed");
                    setImageFile(null);
                    setPreview("");
                    setFileKey((prev) => prev + 1);
                    return;
                  }

                  if (file.size > 2 * 1024 * 1024) {
                    setError("Image must be smaller than 2MB");
                    setImageFile(null);
                    setPreview("");
                    setFileKey((prev) => prev + 1);
                    return;
                  }

                  setError("");

                  setImageFile(file);

                  const reader = new FileReader();
                  reader.onload = () => {
                    setPreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }}
                className="w-full rounded-2xl border border-white/10 bg-white/4 px-3 py-2 text-sm text-white transition-all file:mr-3 file:rounded-xl file:border-0 file:bg-sky-400/15 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-sky-200 hover:file:bg-sky-400/20 focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5 hover:border-white/20"
              />
            </div>

            {preview && (
              <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 p-3">
                <img
                  src={preview}
                  alt="preview"
                  className="w-14 h-14 rounded-2xl object-cover border border-white/20"
                />

                <div>
                  <p className="text-sm text-white/70">Profile preview</p>

                  <p className="text-xs text-white/30">
                    Image selected successfully
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-2xl bg-sky-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition-all hover:-translate-y-0.5 hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                  Creating account...
                </div>
              ) : (
                "Create PulseNet account"
              )}
            </button>
          </form>

          <div className="mt-7 rounded-2xl border border-white/8 bg-white/3 px-4 py-4">
            <p className="text-center text-sm text-white/35">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-sky-300 transition-colors hover:text-sky-200"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

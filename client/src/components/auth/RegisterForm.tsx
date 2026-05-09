import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";
import { validateRegister } from "../../validators/auth/validateRegister";
import { StringNormalizer } from "../../helpers/normalization/StringNormalizer";
import { AuthMessages } from "../../constants/messages/auth/AuthMessages";
import { CommonMessages } from "../../constants/messages/common/CommonMessages";

export function RegisterForm({ authApi }: { authApi: IAuthAPIService }) {
  const { login } = useAuth();
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
    <div className="w-full max-w-sm">
      <div className="text-center mb-10">
        <div className="w-12 h-12 rounded-2xl bg-white/8 border border-white/12 flex items-center justify-center mx-auto mb-4">
          <span className="text-white/60 text-lg">◈</span>
        </div>
        <h1 className="text-xl font-semibold text-white">Create account</h1>
        <p className="text-sm text-white/35 mt-1">Register to get started</p>
      </div>

      {error && (
        <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <div>
          <label className="block text-xs text-white/40 mb-2 font-medium">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={40}
            className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
            placeholder="your_username"
          />
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-2 font-medium">
            FullName
          </label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            maxLength={100}
            className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
            placeholder="your_fullname"
          />
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-2 font-medium">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            required
            className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
            placeholder="your_email"
          />
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-2 font-medium">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
            placeholder="Min 8 chars, 1 uppercase, 1 number"
          />
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-2 font-medium">
            Bio
          </label>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={300}
            className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
            placeholder="your_bio"
          />
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-2 font-medium">
            Profile image
          </label>

          <input
            key={fileKey}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) {
                setImageFile(null);
                setPreview("");
                return;
              }

              const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
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
            className="w-full bg-white/4 border border-white/10 rounded-xl px-3 py-2 text-white text-sm file:bg-white/10 file:border-0 file:text-white file:px-3 file:py-1 file:rounded-lg"
          />
        </div>

        {preview && (
          <div className="mt-3 flex items-center gap-3">
            <img
              src={preview}
              alt="preview"
              className="w-16 h-16 rounded-full object-cover border border-white/20"
            />
            <span className="text-xs text-white/40">Preview</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-white hover:bg-white/90 disabled:opacity-50 text-black font-semibold rounded-xl py-3 text-sm transition-colors"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-center text-white/30 text-sm mt-6">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-white/60 hover:text-white transition-colors"
        >
          Sign in
        </a>
      </p>
    </div>
  );
}

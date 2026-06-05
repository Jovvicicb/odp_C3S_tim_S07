import { useState } from "react";

import { ErrorBox } from "../../../ui/feedback/ErrorBox";

import { FileValidationMessages } from "../../../../constants/messages/common/FileValidationMessages";
import { UserMessages } from "../../../../constants/messages/user/UserMessages";
import { CommonMessages } from "../../../../constants/messages/common/CommonMessages";

import { ImageHelper } from "../../../../helpers/images/ImageHelper";
import { StringNormalizer } from "../../../../helpers/normalization/StringNormalizer";

import { useUpdateMe } from "../../../../hooks/users/settings/useUpdateMe";
import { useToast } from "../../../../hooks/toast/useToast";

import type { UserDto } from "../../../../models/users/UserDto";

import { validateUpdateMe } from "../../../../validators/user/validateUpdateMe";

type Props = {
  profile: UserDto;
  onUpdated?: () => void;
};

export default function EditProfileForm({ profile, onUpdated }: Props) {
  const [username, setUsername] = useState(profile.username);
  const [fullname, setFullname] = useState(profile.fullname ?? "");
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState(profile.bio ?? "");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [fileKey, setFileKey] = useState(0);

  const { updateMe, loading, error, setError } = useUpdateMe();

  const currentImageUrl = ImageHelper.getImageUrl(profile.image);

  const { showToast } = useToast();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateUpdateMe({
      username,
      fullname,
      email,
      password,
      bio,
      imageFile,
      removeImage,
    });

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    try {
      const formData = new FormData();

      const normalizedUsername = StringNormalizer.trim(username);
      const normalizedFullname = StringNormalizer.normalizeSpaces(fullname);
      const normalizedEmail = StringNormalizer.normalizeEmail(email);
      const normalizedBio = StringNormalizer.trim(bio);

      if (normalizedUsername !== profile.username) {
        formData.append("username", normalizedUsername);
      }

      if (normalizedFullname !== (profile.fullname ?? "")) {
        formData.append("fullname", normalizedFullname);
      }

      if (normalizedEmail !== profile.email) {
        formData.append("email", normalizedEmail);
      }

      if (password !== "") {
        formData.append("password", password);
      }

      if (normalizedBio !== (profile.bio ?? "")) {
        formData.append("bio", normalizedBio);
      }

      if (removeImage && profile.image) {
        formData.append("removeImage", "true");
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if ([...formData.keys()].length === 0) {
        setError("No fields to update");
        return;
      }

      const updated = await updateMe(formData);

      if (updated) {
        showToast({
          type: "success",
          message: UserMessages.updateSuccess,
        });

        onUpdated?.();

        setPassword("");
        setImageFile(null);
        setPreview("");
        setRemoveImage(false);
        setFileKey((prev) => prev + 1);
      }
    } catch {
      setError(CommonMessages.unexpectedError);
    }
  };

  return (
    <section>
      <form
        noValidate
        onSubmit={submit}
        className="mx-auto flex w-full max-w-2xl flex-col gap-6"
      >
        {error && <ErrorBox message={error} />}

        <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/3 p-4">
          {preview ? (
            <img
              src={preview}
              alt="profile preview"
              className="h-20 w-20 rounded-2xl border border-white/20 object-cover"
            />
          ) : currentImageUrl && !removeImage ? (
            <img
              src={currentImageUrl}
              alt={profile.username}
              className="h-20 w-20 rounded-2xl border border-white/20 object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/10">
              <span className="text-2xl font-bold text-sky-200">
                {profile.username[0]?.toUpperCase()}
              </span>
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-white/80">Profile image</p>

            <p className="mt-1 text-xs leading-6 text-white/35">
              Upload a new image or remove the current one.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              maxLength={40}
              placeholder="your_username"
              className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35">
              Full name
            </label>

            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              maxLength={100}
              placeholder="your full name"
              className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6"
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
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35">
            New password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            placeholder="leave empty to keep current password"
            className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35">
            Bio
          </label>

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={300}
            rows={3}
            placeholder="short bio about you"
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm leading-6 text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35">
            Upload image
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

              const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

              if (!allowedTypes.includes(file.type)) {
                setError(FileValidationMessages.imageInvalid);
                setImageFile(null);
                setPreview("");
                setFileKey((prev) => prev + 1);
                return;
              }

              if (file.size > 2 * 1024 * 1024) {
                setError(FileValidationMessages.imageTooLarge);
                setImageFile(null);
                setPreview("");
                setFileKey((prev) => prev + 1);
                return;
              }

              setError("");
              setRemoveImage(false);
              setImageFile(file);

              const reader = new FileReader();

              reader.onload = () => {
                setPreview(reader.result as string);
              };

              reader.readAsDataURL(file);
            }}
            className="w-full rounded-2xl border border-white/10 bg-white/4 px-3 py-2 text-sm text-white transition-all file:mr-3 file:rounded-xl file:border-0 file:bg-sky-400/15 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-sky-200 hover:file:bg-sky-400/20 focus:border-sky-300/40 focus:bg-white/6"
          />
        </div>

        {profile.image && (
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-3 text-sm text-white/50 transition-all hover:bg-white/5">
            <input
              type="checkbox"
              checked={removeImage}
              onChange={(e) => {
                setRemoveImage(e.target.checked);

                if (e.target.checked) {
                  setImageFile(null);
                  setPreview("");
                  setFileKey((prev) => prev + 1);
                }
              }}
              className="h-4 w-4 accent-sky-400"
            />
            Remove current profile image
          </label>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-2xl bg-sky-400 px-6 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition-all hover:-translate-y-0.5 hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
              Saving profile...
            </div>
          ) : (
            "Save profile changes"
          )}
        </button>
      </form>
    </section>
  );
}

import { useState } from "react";
import { ErrorBox } from "../ui/UI";
import { StringNormalizer } from "../../helpers/normalization/StringNormalizer";
import { useCreateCommunity } from "../../hooks/community/useCreateCommunity";
import { validateCreateCommunity } from "../../validators/community/validateCreateCommunity";
import type { CommunityType } from "../../types/community/CommunityType";
import { useToast } from "../../hooks/toast/useToast";
import { CommunityMessages } from "../../constants/messages/community/CommunityMessages";
import { useNavigate } from "react-router-dom";
import { CommonMessages } from "../../constants/messages/common/CommonMessages";

export default function CommunityForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [type, setType] = useState<CommunityType>("public");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [fileKey, setFileKey] = useState(0);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const { createCommunity, loading, error, setError } = useCreateCommunity();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateCreateCommunity({
      name,
      description,
      rules,
      type,
      avatar,
    });

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", StringNormalizer.normalizeSpaces(name));
      formData.append("description", StringNormalizer.trim(description));
      formData.append("rules", StringNormalizer.trim(rules));
      formData.append("type", type);

      if (avatar) {
        formData.append("image", avatar);
      }

      const createdCommunity = await createCommunity(formData);

      if (!createdCommunity) return;

      showToast({
        type: "success",
        message: CommunityMessages.createSuccess,
      });

      navigate(`/communities/${createdCommunity.id}`);
    } catch {
      setError(CommonMessages.unexpectedError);
    }
  };

  return (
    <section>
      <div className="mb-7 rounded-2xl border border-white/8 bg-white/3 px-5 py-4">
        <p className="text-base leading-7 text-white/55">
          Start a new public or private community, define its purpose, upload an
          image and set clear rules for members.
        </p>
      </div>

      <form
        noValidate
        onSubmit={submit}
        className="mx-auto flex w-full max-w-2xl flex-col gap-6"
      >
        {error && <ErrorBox message={error} />}

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35">
            Community name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
            maxLength={80}
            required
            placeholder="community name"
            className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="What is this community about?"
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm leading-6 text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35">
            Rules
          </label>

          <textarea
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Define basic community rules..."
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm leading-6 text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
          />
        </div>

        <div>
          <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-white/35">
            Community type
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setType("public")}
              className={`rounded-2xl border px-5 py-4 text-left transition-all ${
                type === "public"
                  ? "border-sky-300/30 bg-sky-400/10 shadow-lg shadow-sky-500/10"
                  : "border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/6"
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  type === "public" ? "text-sky-100" : "text-white/70"
                }`}
              >
                Public
              </p>

              <p className="mt-1 text-xs leading-5 text-white/35">
                Anyone can discover and view this community.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setType("private")}
              className={`rounded-2xl border px-5 py-4 text-left transition-all ${
                type === "private"
                  ? "border-sky-300/30 bg-sky-400/10 shadow-lg shadow-sky-500/10"
                  : "border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/6"
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  type === "private" ? "text-sky-100" : "text-white/70"
                }`}
              >
                Private
              </p>

              <p className="mt-1 text-xs leading-5 text-white/35">
                Users must be approved before joining this community.
              </p>
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35">
            Avatar image
          </label>

          <input
            key={fileKey}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) {
                setAvatar(null);
                setPreview("");
                return;
              }

              const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
              if (!allowedTypes.includes(file.type)) {
                setError("Only JPG, PNG or WEBP images are allowed");
                setAvatar(null);
                setPreview("");
                setFileKey((prev) => prev + 1);
                return;
              }

              if (file.size > 2 * 1024 * 1024) {
                setError("Image must be smaller than 2MB");
                setAvatar(null);
                setPreview("");
                setFileKey((prev) => prev + 1);
                return;
              }

              setError("");

              setAvatar(file);

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
          className="mt-2 rounded-2xl bg-sky-400 px-6 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition-all hover:-translate-y-0.5 hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
              Creating community...
            </div>
          ) : (
            "Create community"
          )}
        </button>
      </form>
    </section>
  );
}

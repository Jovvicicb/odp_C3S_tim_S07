import { useState } from "react";
import { ErrorBox, SuccessBox } from "../ui/UI";
import { StringNormalizer } from "../../helpers/normalization/StringNormalizer";
import { useCreateCommunity } from "../../hooks/community/useCreateCommunity";
import { validateCreateCommunity } from "../../validators/community/validateCreateCommunity";
import type { CommunityType } from "../../types/community/CommunityType";

export default function CommunityForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [type, setType] = useState<CommunityType>("public");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [fileKey, setFileKey] = useState(0);

  const { createCommunity, loading, error, success, setError } =
    useCreateCommunity();

  const resetForm = () => {
    setName("");
    setDescription("");
    setRules("");
    setType("public");
    setAvatar(null);
    setPreview("");
    setFileKey((prev) => prev + 1);
  };

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

    const formData = new FormData();

    formData.append("name", StringNormalizer.normalizeSpaces(name));
    formData.append("description", StringNormalizer.trim(description));
    formData.append("rules", StringNormalizer.trim(rules));
    formData.append("type", type);

    if (avatar) {
      formData.append("image", avatar);
    }

    const created = await createCommunity(formData);

    if (created) {
      resetForm();
    }
  };

  return (
    <section>
      <div className="mb-5">
        <p className="text-sm text-white/30 mt-1">
          Start a new public or private community and define its rules.
        </p>
      </div>

      <form
        noValidate
        onSubmit={submit}
        className="max-w-xl w-full mx-auto flex flex-col gap-5"
      >
        {error && <ErrorBox message={error} />}
        {success && <SuccessBox message={success} />}

        <div>
          <label className="text-xs text-white/40 mb-2 block">
            Community Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-white/20"
            minLength={2}
            maxLength={80}
            required
            placeholder="Enter community name"
          />
        </div>

        <div>
          <label className="text-xs text-white/40 mb-2 block">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-white/20 resize-none"
            rows={3}
            maxLength={500}
            placeholder="What is this community about..."
          />
        </div>

        <div>
          <label className="text-xs text-white/40 mb-2 block">Rules</label>

          <textarea
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-white/20 resize-none"
            rows={3}
            maxLength={500}
            placeholder="Community rules..."
          />
        </div>

        <div>
          <label className="text-xs text-white/40 mb-2 block">
            Community type
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setType("public")}
              className={`px-4 py-2 rounded-xl text-sm border transition ${
                type === "public"
                  ? "bg-white/10 text-white border-white/20"
                  : "bg-white/5 text-white/40 border-white/10"
              }`}
            >
              Public
            </button>

            <button
              type="button"
              onClick={() => setType("private")}
              className={`px-4 py-2 rounded-xl text-sm border transition ${
                type === "private"
                  ? "bg-white/10 text-white border-white/20"
                  : "bg-white/5 text-white/40 border-white/10"
              }`}
            >
              Private
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-2 font-medium">
            Community image
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

              const validation = validateCreateCommunity({
                name: name || "aa",
                description,
                rules,
                type,
                avatar: file,
              });

              if (!validation.valid) {
                setError(validation.message);
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
            className="w-full bg-white/4 border border-white/10 rounded-xl px-3 py-2 text-white text-sm file:bg-white/10 file:border-0 file:text-white file:px-3 file:py-1 file:rounded-lg"
          />
        </div>

        {preview && (
          <div className="mt-1 flex items-center gap-3">
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
          className="mt-2 bg-white hover:bg-white/90 disabled:opacity-50 text-black font-semibold rounded-xl py-4 px-1 text-sm transition-colors"
        >
          {loading ? "Creating community..." : "Create Community"}
        </button>
      </form>
    </section>
  );
}

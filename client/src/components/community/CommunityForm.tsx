import { useState } from "react";
import { ErrorBox, SuccessBox } from "../ui/UI";
import { communityApi } from "../../api_services/community/CommunityAPIService";
import { useNavigate } from "react-router-dom";
import type { CommunityType } from "../../types/community/CommunityTypes";

export default function CommunityForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [type, setType] = useState<CommunityType>("public");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileKey, setFileKey] = useState(0);

  const resetForm = () => {
    setName("");
    setDescription("");
    setRules("");
    setType("public");
    setAvatar(null);
    setPreview("");
  };

  const validate = () => {
    if (!name.trim()) {
      return "Community name is required";
    }

    if (name.trim().length < 2 || name.trim().length > 80) {
      return "Community name must be between 2 and 80 characters";
    }

    if (description.trim().length > 500) {
      return "Description must be at most 500 characters";
    }

    if (rules.trim().length > 250) {
      return "Rules must be at most 250 characters";
    }

    if (type !== "public" && type !== "private") {
      return "Invalid community type";
    }

    if (avatar) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedTypes.includes(avatar.type)) {
        return "Only JPG, PNG or WEBP images are allowed";
      }

      if (avatar.size > 2 * 1024 * 1024) {
        return "Image must be smaller than 2MB";
      }
    }
    return null;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("rules", rules);
    formData.append("type", type);

    if (avatar) {
      formData.append("image", avatar);
    }

    try {
      const res = await communityApi.create(formData);

      console.log(res);
      if (!res.success || !res.data) {
        setError(res.message ?? "Create community failed");
        return;
      }
      setSuccess("Community created successfuly");
      resetForm();
      setTimeout(() => {
        navigate(`/communities/${res.data?.id}`);
      }, 500);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
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
            maxLength={250}
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
            className="mt-2 bg-white hover:bg-white/90 disabled:opacity-50 text-black font-semibold rounded-xl py-5 px-1 text-sm transition-colors"
          >
            {loading ? "Creating community..." : "Create Community"}
          </button>
        </div>
      </form>
    </section>
  );
}

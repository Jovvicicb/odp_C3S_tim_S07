import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ErrorBox } from "../ui/UI";
import { StringNormalizer } from "../../helpers/normalization/StringNormalizer";
import { useCreatePost } from "../../hooks/posts/useCreatePost";
import { validateCreatePost } from "../../validators/post/validateCreatePost";
import { useToast } from "../../hooks/toast/useToast";
import { PostMessages } from "../../constants/messages/post/PostMessages";
import { CommonMessages } from "../../constants/messages/common/CommonMessages";

export default function PostForm() {
  const { communityId } = useParams();
  const parsedCommunityId = Number(communityId);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [fileKey, setFileKey] = useState(0);

  const { createPost, loading, error, setError } = useCreatePost();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateCreatePost({
      title,
      content,
      communityId: Number.isNaN(parsedCommunityId) ? null : parsedCommunityId,
      imageFile,
    });

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", StringNormalizer.normalizeSpaces(title));
      formData.append("content", StringNormalizer.trim(content));
      formData.append("communityId", String(parsedCommunityId));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const createdPost = await createPost(formData);

      if (!createdPost) return;

      showToast({
        type: "success",
        message: PostMessages.createSuccess,
      });

      navigate(`/communities/${createdPost.communityId}`);
    } catch {
      setError(CommonMessages.unexpectedError);
    }
  };

  return (
    <section>
      <div className="mb-7 rounded-2xl border border-white/8 bg-white/3 px-5 py-4">
        <p className="text-base leading-7 text-white/55">
          Create a new post for this community. Add a clear title, write your
          content and optionally attach an image.
        </p>
      </div>

      <form
        noValidate
        onSubmit={submit}
        className="mx-auto flex w-full max-w-2xl flex-col gap-6"
      >
        {error && <ErrorBox message={error} />}

        <div>
          <label
            htmlFor="post-title"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35"
          >
            Post title
          </label>

          <input
            id="post-title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            minLength={5}
            maxLength={200}
            required
            placeholder="Enter post title..."
            className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
          />
        </div>

        <div>
          <label
            htmlFor="post-content"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35"
          >
            Content
          </label>

          <textarea
            id="post-content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            minLength={10}
            maxLength={10000}
            required
            placeholder="Write your post content..."
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm leading-6 text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
          />
        </div>

        <div>
          <label
            htmlFor="post-image"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35"
          >
            Image
          </label>

          <input
            key={fileKey}
            id="post-image"
            name="image"
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
                setError("Only JPG, PNG or WEBP images are allowed");
                setImageFile(null);
                setPreview("");
                setFileKey((prev) => prev + 1);
                return;
              }

              if (file.size > 5 * 1024 * 1024) {
                setError("Image must be smaller than 5MB");
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
            className="w-full rounded-2xl border border-white/10 bg-white/4 px-3 py-2 text-sm text-white transition-all file:mr-3 file:rounded-xl file:border-0 file:bg-sky-400/15 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-sky-200 hover:border-white/20 hover:file:bg-sky-400/20 focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
          />
        </div>

        {preview && (
          <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 p-3">
            <img
              src={preview}
              alt="Post preview"
              className="h-16 w-16 rounded-2xl border border-white/20 object-cover"
            />

            <div>
              <p className="text-sm text-white/70">Image preview</p>

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
              Creating post...
            </div>
          ) : (
            "Create post"
          )}
        </button>
      </form>
    </section>
  );
}

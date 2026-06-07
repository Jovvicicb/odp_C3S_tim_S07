import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ErrorBox } from "../../../ui/feedback/ErrorBox";
import { SubmitButton } from "../../../ui/button/SubmitButton";

import { CommonMessages } from "../../../../constants/messages/common/CommonMessages";
import { PostMessages } from "../../../../constants/messages/post/PostMessages";
import { PostValidationMessages } from "../../../../constants/messages/post/PostValidationMessages";

import { StringNormalizer } from "../../../../helpers/normalization/StringNormalizer";

import { usePostImageInput } from "../../../../hooks/posts/create/usePostImageInput";
import { useCreatePost } from "../../../../hooks/posts/create/useCreatePost";
import { useToast } from "../../../../hooks/toast/useToast";

import { validateCreatePost } from "../../../../validators/post/ValidateCreatePost";

import { PostImageInput } from "../shared/PostImageInput";
import { PostMarkdownEditor } from "../shared/PostMarkdownEditor";
import { PostTitleInput } from "../shared/PostTitleInput";

export default function CreatePostForm() {
  const { communityId } = useParams();
  const parsedCommunityId = Number(communityId);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { createPost, loading, error, setError } = useCreatePost();

  const { imageFile, preview, fileKey, handleImageChange } =
    usePostImageInput(setError);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const communityIdValue =
      Number.isInteger(parsedCommunityId) && parsedCommunityId > 0
        ? parsedCommunityId
        : null;

    const validation = validateCreatePost({
      title,
      content,
      communityId: communityIdValue,
      imageFile,
    });

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    if (communityIdValue === null) {
      setError(PostValidationMessages.communityInvalid);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", StringNormalizer.normalizeSpaces(title));
      formData.append("content", StringNormalizer.trim(content));
      formData.append("communityId", String(communityIdValue));

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
      <form
        noValidate
        onSubmit={submit}
        className="mx-auto flex w-full max-w-2xl flex-col gap-6"
      >
        {error && <ErrorBox message={error} />}

        <PostTitleInput value={title} onChange={setTitle} />

        <PostMarkdownEditor value={content} onChange={setContent} />

        <PostImageInput
          fileKey={fileKey}
          preview={preview}
          onChange={handleImageChange}
        />

        <SubmitButton
          label="Create post"
          loadingLabel="Creating post..."
          loading={loading}
        />
      </form>
    </section>
  );
}

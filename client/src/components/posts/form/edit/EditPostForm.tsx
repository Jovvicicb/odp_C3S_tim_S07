import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { CommonMessages } from "../../../../constants/messages/common/CommonMessages";
import { PostMessages } from "../../../../constants/messages/post/PostMessages";

import { ImageHelper } from "../../../../helpers/images/ImageHelper";
import { StringNormalizer } from "../../../../helpers/normalization/StringNormalizer";

import { usePostDetails } from "../../../../hooks/posts/details/core/usePostDetails";
import { usePostImageInput } from "../../../../hooks/posts/create/usePostImageInput";
import { useUpdatePost } from "../../../../hooks/posts/edit/useUpdatePost";
import { useToast } from "../../../../hooks/toast/useToast";

import type { PostDetailsDto } from "../../../../models/posts/PostDetailsDto";

import { validateUpdatePost } from "../../../../validators/post/validateUpdatePost";

import { SubmitButton } from "../../../ui/button/SubmitButton";
import { ErrorBox } from "../../../ui/feedback/ErrorBox";
import { Spinner } from "../../../ui/spinner/Spinner";
import { SectionEmptyState } from "../../../ui/empty/SectionEmptyState";

import { PostImageInput } from "../shared/PostImageInput";
import { PostMarkdownEditor } from "../shared/PostMarkdownEditor";
import { PostTitleInput } from "../shared/PostTitleInput";

type Props = {
  postId: number;
};

export function EditPostForm({ postId }: Props) {
  const {
    postDetails,
    loading: loadingPost,
    error: fetchError,
  } = usePostDetails(postId, 1, 1, "newest");

  if (loadingPost) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={24} />
      </div>
    );
  }

  if (!postDetails) {
    return (
      <SectionEmptyState
        title="Post not found."
        description={
          fetchError ||
          "The post you are trying to edit does not exist or is no longer available."
        }
      />
    );
  }

  return <EditPostFieldsForm post={postDetails} />;
}

function EditPostFieldsForm({ post }: { post: PostDetailsDto }) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    updatePost,
    loading: updateLoading,
    error: updateError,
    setError,
  } = useUpdatePost();

  const { imageFile, preview, fileKey, handleImageChange } =
    usePostImageInput(setError);

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [removeMedia, setRemoveMedia] = useState(false);

  const currentImageUrl =
    post.mediaUrl && !removeMedia
      ? ImageHelper.getImageUrl(post.mediaUrl)
      : null;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateUpdatePost({
      title,
      content,
      imageFile,
    });

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    try {
      const formData = new FormData();

      const normalizedTitle = StringNormalizer.normalizeSpaces(title);
      const normalizedContent = StringNormalizer.trim(content);

      if (normalizedTitle !== post.title) {
        formData.append("title", normalizedTitle);
      }

      if (normalizedContent !== post.content) {
        formData.append("content", normalizedContent);
      }

      if (removeMedia && post.mediaUrl) {
        formData.append("removeMedia", "true");
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if ([...formData.keys()].length === 0) {
        setError("No fields to update");
        return;
      }

      const updated = await updatePost(post.id, formData);

      if (!updated) return;

      showToast({
        type: "success",
        message: PostMessages.updateSuccess,
      });

      navigate(`/posts/${post.id}`);
    } catch {
      setError(CommonMessages.unexpectedError);
    }
  };

  return (
    <form
      noValidate
      onSubmit={submit}
      className="mx-auto flex w-full max-w-2xl flex-col gap-6"
    >
      {updateError && <ErrorBox message={updateError} />}

      <PostTitleInput value={title} onChange={setTitle} />

      <PostMarkdownEditor value={content} onChange={setContent} />

      <PostImageInput
        fileKey={fileKey}
        preview={preview}
        currentImageUrl={currentImageUrl}
        removeCurrentImage={removeMedia}
        onChange={(file) => {
          setRemoveMedia(false);
          handleImageChange(file);
        }}
        onRemoveCurrentImage={() => setRemoveMedia(true)}
        onUndoRemoveCurrentImage={() => setRemoveMedia(false)}
      />

      <SubmitButton
        label="Save post changes"
        loadingLabel="Saving post..."
        loading={updateLoading}
      />
    </form>
  );
}

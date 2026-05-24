import { useState, type Dispatch, type SetStateAction } from "react";
import { postApi } from "../../../../api_services/posts/PostAPIService";
import { PostMessages } from "../../../../constants/messages/post/PostMessages";
import type { PostDetailsDto } from "../../../../models/posts/PostDetailsDto";
import type { PostTagDto } from "../../../../models/tags/PostTagDto";
import { useToast } from "../../../toast/useToast";

type Props = {
  setPostDetails: Dispatch<SetStateAction<PostDetailsDto | null>>;
};

function addTagToPostState(
  current: PostDetailsDto,
  tag: PostTagDto,
): PostDetailsDto {
  const alreadyExists = current.tags.some((existingTag) => existingTag.id === tag.id);

  if (alreadyExists) {
    return current;
  }

  return {
    ...current,
    tags: [...current.tags, tag],
  };
}

function removeTagFromPostState(
  current: PostDetailsDto,
  tagId: number,
): PostDetailsDto {
  return {
    ...current,
    tags: current.tags.filter((tag) => tag.id !== tagId),
  };
}

export function usePostTagActions({ setPostDetails }: Props) {
  const { showToast } = useToast();

  const [loadingPostTagAddId, setLoadingPostTagAddId] = useState<number | null>(
    null,
  );
  const [loadingPostTagRemoveId, setLoadingPostTagRemoveId] = useState<
    number | null
  >(null);
  const [postTagActionError, setPostTagActionError] = useState("");

  const handleAddPostTag = async (postId: number, tag: PostTagDto) => {
    setLoadingPostTagAddId(tag.id);
    setPostTagActionError("");

    try {
      const res = await postApi.addTag(postId, tag.id);

      if (!res.success) {
        setPostTagActionError(res.message ?? PostMessages.addTagFailed);
        return false;
      }

      setPostDetails((current) =>
        current ? addTagToPostState(current, tag) : current,
      );

      showToast({
        type: "success",
        message: res.message ?? PostMessages.addTagSuccess,
      });

      return true;
    } catch {
      setPostTagActionError(PostMessages.addTagFailed);
      return false;
    } finally {
      setLoadingPostTagAddId(null);
    }
  };

  const handleRemovePostTag = async (postId: number, tagId: number) => {
    setLoadingPostTagRemoveId(tagId);
    setPostTagActionError("");

    try {
      const res = await postApi.removeTag(postId, tagId);

      if (!res.success) {
        setPostTagActionError(res.message ?? PostMessages.removeTagFailed);
        return false;
      }

      setPostDetails((current) =>
        current ? removeTagFromPostState(current, tagId) : current,
      );

      showToast({
        type: "success",
        message: res.message ?? PostMessages.removeTagSuccess,
      });

      return true;
    } catch {
      setPostTagActionError(PostMessages.removeTagFailed);
      return false;
    } finally {
      setLoadingPostTagRemoveId(null);
    }
  };

  return {
    handleAddPostTag,
    handleRemovePostTag,
    loadingPostTagAddId,
    loadingPostTagRemoveId,
    postTagActionError,
  };
}
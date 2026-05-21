import { useState, type Dispatch, type SetStateAction } from "react";
import { postApi } from "../../../api_services/posts/PostAPIService";
import { PostMessages } from "../../../constants/messages/post/PostMessages";
import type { PostDetailsDto } from "../../../models/post/PostDetailsDto";
import { useToast } from "../../toast/useToast";

type Props = {
  setPostDetails: Dispatch<SetStateAction<PostDetailsDto | null>>;
};

export function usePostDetailsActions({ setPostDetails }: Props) {
  const { showToast } = useToast();

  const [loadingPostLike, setLoadingPostLike] = useState(false);
  const [postActionError, setPostActionError] = useState("");

  const handleLikePost = async (postId: number) => {
    setLoadingPostLike(true);
    setPostActionError("");

    try {
      const res = await postApi.like(postId);

      if (!res.success) {
        setPostActionError(res.message ?? PostMessages.likeFailed);
        return;
      }

      setPostDetails((current) =>
        current
          ? {
              ...current,
              likedByCurrentUser: true,
              likeCount: current.likeCount + 1,
            }
          : current,
      );

      showToast({
        type: "success",
        message: res.message ?? "Post liked successfully",
      });
    } catch {
      setPostActionError(PostMessages.likeFailed);
    } finally {
      setLoadingPostLike(false);
    }
  };

  const handleUnlikePost = async (postId: number) => {
    setLoadingPostLike(true);
    setPostActionError("");

    try {
      const res = await postApi.unlike(postId);

      if (!res.success) {
        setPostActionError(res.message ?? PostMessages.unlikeFailed);
        return;
      }

      setPostDetails((current) =>
        current
          ? {
              ...current,
              likedByCurrentUser: false,
              likeCount: Math.max(0, current.likeCount - 1),
            }
          : current,
      );

      showToast({
        type: "success",
        message: res.message ?? "Post unliked successfully",
      });
    } catch {
      setPostActionError(PostMessages.unlikeFailed);
    } finally {
      setLoadingPostLike(false);
    }
  };

  return {
    handleLikePost,
    handleUnlikePost,
    loadingPostLike,
    postActionError,
  };
}
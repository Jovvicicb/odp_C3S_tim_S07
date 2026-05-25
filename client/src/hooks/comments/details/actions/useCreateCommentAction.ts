import { useState } from "react";
import { useToast } from "../../../toast/useToast";
import { validateCreateComment } from "../../../../validators/comment/ValidateCreateComment";
import { commentApi } from "../../../../api_services/comments/CommentAPIService";
import { CommentMessages } from "../../../../constants/messages/comment/CommentMessages";

type Props = {
  reloadPostDetails: () => Promise<void>;
};

export function useCreateCommentAction({ reloadPostDetails }: Props) {
  const { showToast } = useToast();

  const [loadingCommentCreate, setLoadingCommentCreate] = useState(false);
  const [commentCreateError, setCommentCreateError] = useState("");

  const handleCreateComment = async (
    postId: number,
    content: string,
    parentId: number | null = null,
  ) => {
    const validation = validateCreateComment({
      postId,
      content,
      parentId,
    });

    if (!validation.valid || !validation.normalizedContent) {
      setCommentCreateError(validation.message);
      return false;
    }

    setLoadingCommentCreate(true);
    setCommentCreateError("");

    try {
      const res = await commentApi.create(
        postId,
        validation.normalizedContent,
        parentId,
      );

      if (!res.success) {
        setCommentCreateError(res.message ?? CommentMessages.createFailed);
        return false;
      }

      showToast({
        type: "success",
        message: res.message ?? "Comment created successfully",
      });

      await reloadPostDetails();

      return true;
    } catch {
      setCommentCreateError(CommentMessages.createFailed);
      return false;
    } finally {
      setLoadingCommentCreate(false);
    }
  };

  return {
    handleCreateComment,
    loadingCommentCreate,
    commentCreateError,
  };
}
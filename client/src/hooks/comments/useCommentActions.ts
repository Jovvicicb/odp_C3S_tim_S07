import { useState } from "react";
import { commentApi } from "../../api_services/comments/CommentAPIService";
import { CommentMessages } from "../../constants/messages/comment/CommentMessages";
import { useToast } from "../toast/useToast";
import { validateCreateComment } from "../../validators/comment/ValidateCreateComment";

type Props = {
  reloadPostDetails: () => Promise<void>;
};

export function useCommentActions({ reloadPostDetails }: Props) {
  const { showToast } = useToast();

  const [loadingCommentCreate, setLoadingCommentCreate] = useState(false);
  const [commentActionError, setCommentActionError] = useState("");

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
    setCommentActionError(validation.message);
    return false;
  }

  setLoadingCommentCreate(true);
  setCommentActionError("");

  try {
    const res = await commentApi.create(
      postId,
      validation.normalizedContent,
      parentId,
    );

    console.log("CREATE COMMENT RESPONSE:", res);

    if (!res.success) {
      setCommentActionError(res.message ?? CommentMessages.createFailed);
      return false;
    }

    showToast({
      type: "success",
      message: res.message ?? "Comment created successfully",
    });

    await reloadPostDetails();

    return true;
  } catch {
    setCommentActionError(CommentMessages.createFailed);
    return false;
  } finally {
    setLoadingCommentCreate(false);
  }
};

  return {
    handleCreateComment,
    loadingCommentCreate,
    commentActionError,
  };
}
import { useState, type Dispatch, type SetStateAction } from "react";
import { commentApi } from "../../api_services/comments/CommentAPIService";
import { CommentMessages } from "../../constants/messages/comment/CommentMessages";
import { useToast } from "../toast/useToast";
import { validateCreateComment } from "../../validators/comment/ValidateCreateComment";
import type { PostDetailsDto } from "../../models/post/PostDetailsDto";

type Props = {
  reloadPostDetails: () => Promise<void>;
  setPostDetails: Dispatch<SetStateAction<PostDetailsDto | null>>;
};

function updateCommentLikeState(
  current: PostDetailsDto,
  commentId: number,
  likedByCurrentUser: boolean,
): PostDetailsDto {
  return {
    ...current,
    comments: {
      ...current.comments,
      items: current.comments.items.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likedByCurrentUser,
            likeCount: likedByCurrentUser
              ? comment.likeCount + 1
              : Math.max(0, comment.likeCount - 1),
          };
        }

        return {
          ...comment,
          replies: comment.replies.map((reply) =>
            reply.id === commentId
              ? {
                  ...reply,
                  likedByCurrentUser,
                  likeCount: likedByCurrentUser
                    ? reply.likeCount + 1
                    : Math.max(0, reply.likeCount - 1),
                }
              : reply,
          ),
        };
      }),
    },
  };
}

export function useCommentActions({
  reloadPostDetails,
  setPostDetails,
}: Props) {
  const { showToast } = useToast();

  const [loadingCommentCreate, setLoadingCommentCreate] = useState(false);
  const [loadingCommentLikeId, setLoadingCommentLikeId] = useState<number | null>(null);
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

  const handleLikeComment = async (commentId: number) => {
    setLoadingCommentLikeId(commentId);
    setCommentActionError("");

    try {
      const res = await commentApi.like(commentId);

      if (!res.success) {
        setCommentActionError(res.message ?? CommentMessages.likeFailed);
        return;
      }

      setPostDetails((current) =>
        current ? updateCommentLikeState(current, commentId, true) : current,
      );
    } catch {
      setCommentActionError(CommentMessages.likeFailed);
    } finally {
      setLoadingCommentLikeId(null);
    }
  };

  const handleUnlikeComment = async (commentId: number) => {
    setLoadingCommentLikeId(commentId);
    setCommentActionError("");

    try {
      const res = await commentApi.unlike(commentId);

      if (!res.success) {
        setCommentActionError(res.message ?? CommentMessages.unlikeFailed);
        return;
      }

      setPostDetails((current) =>
        current ? updateCommentLikeState(current, commentId, false) : current,
      );
    } catch {
      setCommentActionError(CommentMessages.unlikeFailed);
    } finally {
      setLoadingCommentLikeId(null);
    }
  };

  return {
    handleCreateComment,
    handleLikeComment,
    handleUnlikeComment,
    loadingCommentCreate,
    loadingCommentLikeId,
    commentActionError,
  };
}
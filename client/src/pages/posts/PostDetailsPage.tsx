import { useNavigate, useParams } from "react-router-dom";

import { ErrorBox, PageHeader, Spinner } from "../../components/ui/UI";
import { SectionEmptyState } from "../../components/ui/SectionEmptyState";

import { ActionButton } from "../../components/ui/button/ActionButton";

import { PostDetailsCard } from "../../components/posts/details/card/PostDetailsCard";
import { PostCommentsSection } from "../../components/posts/details/comments/PostCommentsSection";

import { usePostDetails } from "../../hooks/posts/details/core/usePostDetails";
import { useCommentActions } from "../../hooks/comments/details/actions/useCommentActions";
import { usePostTagActions } from "../../hooks/posts/details/tags/usePostTagActions";
import { usePostLikeActions } from "../../hooks/posts/details/actions/usePostLikeActions";
import { usePostDeleteAction } from "../../hooks/posts/details/actions/usePostDeleteAction";

export default function PostDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const postId = Number(id);
  const parsedPostId = Number.isNaN(postId) ? null : postId;

  const {
    postDetails,
    setPostDetails,
    loading,
    error,
    commentsPage,
    commentsLimit,
    commentsSort,
    setCommentsPage,
    setCommentsSort,
    reload,
  } = usePostDetails(parsedPostId, 1, 10, "newest");

  const { handleLikePost, handleUnlikePost, loadingPostLike, postLikeError } =
    usePostLikeActions({
      setPostDetails,
    });

  const { handleDeletePost, loadingPostDelete, postDeleteError } =
    usePostDeleteAction();

  const {
    handleAddPostTag,
    handleRemovePostTag,
    loadingPostTagAddId,
    loadingPostTagRemoveId,
    postTagActionError,
  } = usePostTagActions({
    setPostDetails,
  });

  const {
    handleCreateComment,
    handleLikeComment,
    handleUnlikeComment,
    handleUpdateComment,
    handleDeleteComment,
    handleFlagComment,
    handleUnflagComment,
    loadingCommentCreate,
    loadingCommentLikeId,
    loadingCommentUpdateId,
    loadingCommentDeleteId,
    loadingCommentFlagId,
    commentActionError,
  } = useCommentActions({
    reloadPostDetails: reload,
    setPostDetails,
  });

  const handleEditPost = (postId: number) => {
    navigate(`/posts/${postId}/edit`);
  };

  const handleCreateReply = (parentId: number, content: string) => {
    if (!postDetails) {
      return Promise.resolve(false);
    }

    return handleCreateComment(postDetails.id, content, parentId);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={24} />
      </div>
    );
  }

  if (!postDetails) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Post details"
          title="Post not found"
          action={<ActionButton variant="back" label="Back" />}
        />

        <SectionEmptyState
          title="Post not found."
          description="The post you are trying to open does not exist, was deleted or is no longer available."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Post Details"
        title={postDetails.title}
        action={<ActionButton variant="back" label="Back" />}
      />

      {(error ||
        postLikeError ||
        postDeleteError ||
        postTagActionError ||
        commentActionError) && (
        <ErrorBox
          message={
            error ||
            postLikeError ||
            postDeleteError ||
            postTagActionError ||
            commentActionError
          }
        />
      )}

      <PostDetailsCard
        post={postDetails}
        loadingPostLike={loadingPostLike}
        loadingPostDelete={loadingPostDelete}
        loadingPostTagAddId={loadingPostTagAddId}
        loadingPostTagRemoveId={loadingPostTagRemoveId}
        onLikePost={handleLikePost}
        onUnlikePost={handleUnlikePost}
        onEditPost={handleEditPost}
        onDeletePost={handleDeletePost}
        onAddPostTag={handleAddPostTag}
        onRemovePostTag={handleRemovePostTag}
      />

      <PostCommentsSection
        postId={postDetails.id}
        comments={postDetails.comments}
        totalCommentCount={postDetails.commentCount}
        commentsPage={commentsPage}
        commentsLimit={commentsLimit}
        commentsSort={commentsSort}
        canComment={postDetails.permissions.canComment}
        loadingCommentCreate={loadingCommentCreate}
        loadingCommentLikeId={loadingCommentLikeId}
        loadingCommentUpdateId={loadingCommentUpdateId}
        loadingCommentDeleteId={loadingCommentDeleteId}
        loadingCommentFlagId={loadingCommentFlagId}
        onPageChange={setCommentsPage}
        onSortChange={setCommentsSort}
        onCreateComment={handleCreateComment}
        onCreateReply={handleCreateReply}
        onLikeComment={handleLikeComment}
        onUnlikeComment={handleUnlikeComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        onFlagComment={handleFlagComment}
        onUnflagComment={handleUnflagComment}
      />
    </div>
  );
}

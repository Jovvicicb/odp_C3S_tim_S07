export const PostMessages = {
    created: "Post created successfully",
    createFailed: "Failed to create post",
    communityNotFound: "Community not found",
    notMember: "You must be a member of this community",

    notFound: "Post not found",
    deleted: "Post deleted successfully",
    deleteFailed: "Failed to delete post",
    onlyAuthorOrModeratorCanDelete: "Only post author or community moderator can delete this post",

    
    updated: "Post updated successfully",
    updateFailed: "Failed to update post",
    onlyAuthorOrModeratorCanUpdate: "Only post author or community moderator can update this post",

    tagNotFound: "Tag not found",
    tagAlreadyAdded: "Tag is already added to this post",
    tagAdded: "Tag added to post successfully",
    addTagFailed: "Failed to add tag to post",
    onlyAuthorOrModeratorCanAddTag: "Only post author or community moderator can add tags to this post",

    tagNotAdded: "Tag is not added to this post",
    tagRemoved: "Tag removed from post successfully",
    removeTagFailed: "Failed to remove tag from post",
    onlyAuthorOrModeratorCanRemoveTag: "Only post author or community moderator can remove tags from this post",

} as const;
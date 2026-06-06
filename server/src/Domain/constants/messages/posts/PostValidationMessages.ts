export const PostValidationMessages = {
  titleRequired: "Post title is required",
  titleInvalid: "Post title must be between 5 and 200 characters",

  contentRequired: "Post content is required",
  contentInvalid: "Post content must be between 10 and 10000 characters",

  communityIdRequired: "Post communityId is required",
  communityInvalid: "Invalid community ID",

  noFieldsToUpdate: "No fields to update",

  invalidTagId: "Invalid tag ID",
  authorInvalid: "Post author is invalid.",
} as const;
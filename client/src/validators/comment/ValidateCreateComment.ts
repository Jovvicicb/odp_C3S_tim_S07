import { CommentValidationMessages } from "../../constants/messages/comment/CommentValidationMessages";
import { StringNormalizer } from "../../helpers/normalization/StringNormalizer";
import type { ValidationResult } from "../../types/common/ValidationResult";
import type { CreateCommentInput } from "../../types/comments/CreateCommentInput";

export type ValidateCreateCommentResult = ValidationResult & {
  normalizedContent?: string;
};

export function validateCreateComment(
  input: CreateCommentInput,
): ValidateCreateCommentResult {
  const normalizedContent = StringNormalizer.normalizeSpaces(input.content);

  if (!normalizedContent) {
    return {
      valid: false,
      message: CommentValidationMessages.contentRequired,
    };
  }

  if (normalizedContent.length < 1 || normalizedContent.length > 2000) {
    return {
      valid: false,
      message: CommentValidationMessages.contentInvalid,
    };
  }

  if (!input.postId || input.postId <= 0) {
    return {
      valid: false,
      message: CommentValidationMessages.postInvalid,
    };
  }

  if (
    input.parentId !== undefined &&
    input.parentId !== null &&
    input.parentId <= 0
  ) {
    return {
      valid: false,
      message: CommentValidationMessages.parentInvalid,
    };
  }

  return {
    valid: true,
    message: "",
    normalizedContent,
  };
}
import { CommentValidationMessages } from "../../constants/messages/comment/CommentValidationMessages";
import { StringNormalizer } from "../../helpers/normalization/StringNormalizer";
import type { ValidationResult } from "../../types/common/ValidationResult";

export type ValidateUpdateCommentResult = ValidationResult & {
  normalizedContent?: string;
};

export function validateUpdateComment(
  content?: string | null,
): ValidateUpdateCommentResult {
  const normalizedContent = StringNormalizer.normalizeSpaces(content);

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

  return {
    valid: true,
    message: "",
    normalizedContent,
  };
}
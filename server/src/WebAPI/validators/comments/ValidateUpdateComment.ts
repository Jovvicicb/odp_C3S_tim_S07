import { CommentValidationMessages } from "../../../Domain/constants/messages/comments/CommentValidationMessages";
import { UpdateCommentDto } from "../../../Domain/DTOs/comments/UpdateCommentDto";
import { ValidateUpdateCommentResult } from "../../../Domain/types/comments/ValidateUpdateCommentResult";
import { StringNormalizer } from "../../../Shared/normalization/StringNormalizer";
import { UpdateCommentInput } from "../../types/comments/UpdateCommentInput";

export const validateUpdateComment = (
    input: UpdateCommentInput
): ValidateUpdateCommentResult => {
  const content = StringNormalizer.normalizeSpaces(input.content);

  if (!content) {
    return {
      validation: { valid: false, message: CommentValidationMessages.contentRequired, },
    };
  }

  if (content.length < 1 || content.length > 2000) {
    return {
      validation: { valid: false, message: CommentValidationMessages.contentLength, },
    };
  }

  return {
    validation: { valid: true },
    dto: new UpdateCommentDto(content),
  };
};
import { CommentValidationMessages } from "../../../Domain/constants/messages/comments/CommentValidationMessages";
import { CreateCommentDto } from "../../../Domain/DTOs/comments/CreateCommentDto";
import { ValidateCreateCommentResult } from "../../../Domain/types/comments/ValidateCreateCommentResult";
import { StringNormalizer } from "../../../Shared/normalization/StringNormalizer";
import { parseId } from "../../parser/common/ParseId";
import { validateId } from "../common/ValidateId";
import { CreateCommentInput } from "../../types/comments/CreateCommentInput";

export const validateCreateComment = (input: CreateCommentInput): ValidateCreateCommentResult => {

  const content =
  typeof input.content === "string"
    ? StringNormalizer.normalizeSpaces(input.content)
    : "";

  if (!content) {
    return {
      validation: { valid: false, message: CommentValidationMessages.contentRequired }
    };
  }

  if (content.length < 1 || content.length > 2000) {
    return {
      validation: { valid: false, message: CommentValidationMessages.contentLength }
    };
  }

 if (input.postId === undefined || input.postId === null || input.postId === "") {
    return {
      validation: { valid: false, message: CommentValidationMessages.invalidPostId }
    };
  }

  const postId = parseId(String(input.postId));
  const postValidation = validateId(postId);

  if (!postValidation.valid) {
    return {
      validation: { valid: false, message: CommentValidationMessages.invalidPostId }
    };
  }

  const parsedParentId =
    input.parentId !== undefined && input.parentId !== null && input.parentId !== ""
      ? parseId(String(input.parentId))
      : null;

  if (parsedParentId !== null) {
    const parentValidation = validateId(parsedParentId);

    if (!parentValidation.valid) {
      return {
        validation: { valid: false, message: CommentValidationMessages.invalidParentId }
      };
    }
  }

  return {
    validation: { valid: true },
    dto: new CreateCommentDto(
      content,
      input.userId,
      postId,
      parsedParentId
    ),
  };
};
import { FileValidationMessages } from "../../constants/messages/common/FileValidationMessages";
import { PostValidationMessages } from "../../constants/messages/post/PostValidationMessages";
import { StringNormalizer } from "../../helpers/normalization/StringNormalizer";
import type { ValidationResult } from "../../types/common/ValidationResult";
import type { CreatePostInput } from "../../types/posts/form/CreatePostInput";

export function validateCreatePost(input?: CreatePostInput | null): ValidationResult {
  const normalizedTitle = StringNormalizer.normalizeSpaces(input?.title);
  const normalizedContent = StringNormalizer.trim(input?.content);

  if (!normalizedTitle) {
    return {
      valid: false,
      message: PostValidationMessages.titleRequired,
    };
  }

  if (normalizedTitle.length < 5 || normalizedTitle.length > 200) {
    return {
      valid: false,
      message: PostValidationMessages.titleInvalid,
    };
  }

  if (!normalizedContent) {
    return {
      valid: false,
      message: PostValidationMessages.contentRequired,
    };
  }

  if (normalizedContent.length < 10 || normalizedContent.length > 10000) {
    return {
      valid: false,
      message: PostValidationMessages.contentInvalid,
    };
  }

  const communityId = input?.communityId;

  if (
    typeof communityId !== "number" ||
    !Number.isInteger(communityId) ||
    communityId < 1
  ) {
    return {
      valid: false,
      message: PostValidationMessages.communityInvalid,
    };
  }

  if (input?.imageFile) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(input.imageFile.type)) {
      return {
        valid: false,
        message: FileValidationMessages.imageInvalid,
      };
    }

    if (input.imageFile.size > 2 * 1024 * 1024) {
      return {
        valid: false,
        message: FileValidationMessages.imageTooLarge,
      };
    }
  }

  return {
    valid: true,
    message: "",
  };
}
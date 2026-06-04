import { FileValidationMessages } from "../../../Domain/constants/messages/common/FileValidationMessages";
import { PostValidationMessages } from "../../../Domain/constants/messages/posts/PostValidationMessages";
import { UpdatePostDto } from "../../../Domain/DTOs/posts/UpdatePostDto";
import { ValidateUpdatePostResult } from "../../../Domain/types/posts/ValidateUpdatePostResult";
import { StringNormalizer } from "../../../Shared/normalization/StringNormalizer";
import { UpdatePostInput } from "../../types/posts/UpdatePostInput";

export const validateUpdatePost = (
    input: UpdatePostInput,
    file?: Express.Multer.File
): ValidateUpdatePostResult => {

 const dto: UpdatePostDto = {};

  if (input.title !== undefined) {
    const title = StringNormalizer.normalizeSpaces(input.title);

    if (!title) {
      return {
        validation: { valid: false, message: PostValidationMessages.titleRequired },
      };
    }

    if (title.length < 5 || title.length > 200) {
      return {
        validation: { valid: false, message: PostValidationMessages.titleInvalid },
      };
    }

    dto.title = title;
  }

  if (input.content !== undefined) {
    const content = StringNormalizer.trim(input.content);

    if (!content) {
      return {
        validation: { valid: false, message: PostValidationMessages.contentRequired },
      };
    }

    if (content.length < 10 || content.length > 10000) {
      return {
        validation: { valid: false, message: PostValidationMessages.contentInvalid },
      };
    }

    dto.content = content;
  }

  if (file) {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(file.mimetype)) {
      return {
        validation: { valid: false, message: FileValidationMessages.imageInvalid },
      };
    }

    if (file.size > 5 * 1024 * 1024) {
      return {
        validation: { valid: false, message: FileValidationMessages.imageTooLarge },
      };
    }

    dto.mediaUrl = file.filename;
  }

  if (input.removeMedia === true || String(input.removeMedia) === "true") {
    dto.mediaUrl = null;
  }

  if (Object.keys(dto).length === 0) {
    return {
      validation: { valid: false, message: PostValidationMessages.noFieldsToUpdate },
    };
  }

  return {
    validation: { valid: true },
    dto,
  };
};
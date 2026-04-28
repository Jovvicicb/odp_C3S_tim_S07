import { FileValidationMessages } from "../../../Domain/constants/messages/common/FileValidationMessages";
import { PostValidationMessages } from "../../../Domain/constants/messages/posts/PostValidationMessages";
import { CreatePostDto } from "../../../Domain/DTOs/Posts/CreatePostDto";
import { ValidateCreatePostResut } from "../../../Domain/types/posts/ValidateCreatePostResut";
import { StringNormalizer } from "../../../Shared/normalization/StringNormalizer";
import { parseId } from "../../parser/common/ParseId";
import { CreatePostInput } from "../../types/posts/CreatePostInput";
import { validateId } from "../common/ValidateId";

export const validateCreatePost = (
  input: CreatePostInput,
  file?: Express.Multer.File,
) : ValidateCreatePostResut => {
  const title = StringNormalizer.normalizeSpaces(input.title);
  const content = StringNormalizer.trim(input.content);

  if (!title) {
    return { validation: { valid: false, message: PostValidationMessages.titleRequired } };
  }

  if (title.length < 5 || title.length > 200) {
    return { validation: { valid: false, message: PostValidationMessages.titleInvalid } };
  }

  if (!content) {
    return { validation: { valid: false, message: PostValidationMessages.contentRequired } };
  }

  if (content.length < 10 || content.length > 10000) {
    return { validation: { valid: false, message: PostValidationMessages.contentInvalid } };
  }

  if (!input.communityId) {
    return { validation: { valid: false, message: PostValidationMessages.communityIdRequired } };
  }

  const communityId = parseId(input.communityId);
  const communityIdValidation = validateId(communityId);
  if (!communityIdValidation.valid) {
    return {
        validation: {
        valid: false,
        message: PostValidationMessages.communityInvalid,
        },
    };
  }

  if (file) {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(file.mimetype)) {
      return { validation: { valid: false, message: FileValidationMessages.imageInvalid } };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { validation: { valid: false, message: FileValidationMessages.imageTooLarge } };
    }
  }

  return {
    validation: { valid: true },
    dto: new CreatePostDto(
      title,
      content,
      file?.filename ?? null,
      input.authorId,
      communityId
    ),
  };
};
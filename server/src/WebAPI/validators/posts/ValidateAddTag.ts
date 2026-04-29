import { PostValidationMessages } from "../../../Domain/constants/messages/posts/PostValidationMessages";
import { ValidateAddTagResult } from "../../../Domain/types/posts/ValidateAddTagResult";
import { parseId } from "../../parser/common/ParseId";
import { validateId } from "../common/ValidateId";

export const validateAddTag = ( input: { tagId?: string}) : ValidateAddTagResult => {
  const tagId = parseId(input.tagId);

  const tagIdValidation = validateId(tagId);
  if (!tagIdValidation.valid) {
    return {
      validation: {
        valid: false,
        message: PostValidationMessages.invalidTagId,
      },
    };
  }

  return {
    validation: { valid: true },
    tagId: tagId
  };
};
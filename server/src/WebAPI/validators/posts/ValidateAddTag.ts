import { PostValidationMessages } from "../../../Domain/constants/messages/posts/PostValidationMessages";
import { ValidateAddTagResult } from "../../../Domain/types/posts/ValidateAddTagResult";
import { parseId } from "../../parser/common/ParseId";
import { validateId } from "../common/ValidateId";
import { AddTagInput } from "../../types/posts/AddTagInput";

export const validateAddTag = (input: AddTagInput): ValidateAddTagResult => {
  if (
    input.tagId === undefined ||
    input.tagId === null ||
    input.tagId === ""
  ) {
    return {
      validation: {
        valid: false,
        message: PostValidationMessages.invalidTagId,
      },
    };
  }

  const tagId = parseId(String(input.tagId));

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
    tagId,
  };
};
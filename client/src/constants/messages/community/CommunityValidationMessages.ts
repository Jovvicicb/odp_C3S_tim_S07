export const CommunityValidationMessages = {
  nameRequired: "Community name is required",
  nameLength: "Community name must be between 2 and 80 characters",
  descriptionTooLong: "Description must be at most 500 characters",
  rulesTooLong: "Rules must be at most 500 characters",
  invalidType: "Invalid community type",
  noFieldsToUpdate: "No fields to update",
  roleRequired: "Role is required",
  invalidMemberRole: "Invalid community member role",
  statusActionRequired: "Status action (accept / deny) is required",
  invalidStatusAction: "Invalid status action",
} as const;
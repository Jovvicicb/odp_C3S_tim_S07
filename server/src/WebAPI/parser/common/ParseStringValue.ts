import { ParsedQs } from "qs";

type StringValue = string | ParsedQs | (string | ParsedQs)[] | undefined;

export const parseStringValue  = (value: StringValue): string | undefined => {
  return typeof value === "string" ? value : undefined;
};
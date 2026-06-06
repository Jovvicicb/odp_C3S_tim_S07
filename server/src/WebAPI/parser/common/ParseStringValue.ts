import { ParsedQs } from "qs";

type StringValue = string | ParsedQs | (string | ParsedQs)[] | undefined | null;

export const parseStringValue = (value: StringValue): string | undefined => {
  return typeof value === "string" ? value : undefined;
};
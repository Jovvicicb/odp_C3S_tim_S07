export const parseId = (value?: string): number => {
  const raw = (value ?? "").trim();

  if (!/^\d+$/.test(raw)) {
    return NaN;
  }

  const parsedId = Number(raw);

  if (!Number.isSafeInteger(parsedId)) {
    return NaN;
  }

  return parsedId;
};
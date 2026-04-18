export const parseId = (value?: string): number => {
  const raw = (value ?? "").trim();

  if (!/^\d+$/.test(raw)) {
    return NaN;
  }

  return Number(raw);
};
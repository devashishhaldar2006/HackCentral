
export const normalizeStringArray = (arr = []) =>
  arr.map((item) => item.trim()).filter(Boolean);

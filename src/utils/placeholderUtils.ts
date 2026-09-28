export const isPlaceholder = (val?: string | null): boolean => {
  if (!val || typeof val !== 'string') return true;
  const trimmed = val.trim();
  return (
    trimmed.startsWith('[') ||
    trimmed.endsWith(']') ||
    /\[.*department.*\]/i.test(trimmed) ||
    /\[.*document.*\]/i.test(trimmed) ||
    /\[.*domain.*\]/i.test(trimmed) ||
    /\[.*government source.*\]/i.test(trimmed) ||
    /\[.*application link.*\]/i.test(trimmed) ||
    /\[.*fee.*\]/i.test(trimmed)
  );
};

export const sanitizeString = (val?: string | null): string | null => {
  if (isPlaceholder(val)) return null;
  return val!.trim();
};

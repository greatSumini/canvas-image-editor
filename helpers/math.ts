export const clamp = (min: number, input: number, max: number) =>
  input != null ? Math.min(max, Math.max(min, input)) : null;

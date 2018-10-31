export const camelize = (input: string): string => input.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

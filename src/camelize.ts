
export const camelize = (input: string): string => input.replace(/-([a-z])/g, (g): string => g[1].toUpperCase());

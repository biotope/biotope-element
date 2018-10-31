export const camelize = (input: string): string => input.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });

import { HTMLElementContent } from './types';

export const kebabToCamel = (string: string): string => string.replace(/-([a-z])/g, (_, item): string => item.toUpperCase());

export const camelToKebab = (string: string): string => string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

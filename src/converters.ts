import { HTMLElementContent } from './types';

export const kebabToCamel = (string: string): string => {
  const parsed = string.replace(/-([a-z])/g, (_, item): string => item.toUpperCase()).replace(/-/g, '');
  return (parsed[0] || '').toLowerCase() + parsed.slice(1);
};

export const camelToKebab = (string: string): string => string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

export const contentToString = (content: HTMLElementContent): string => {
  if (typeof content === 'string') {
    return content;
  }
  return content && typeof content.toString === 'function' ? content.toString() : `${content}`;
};

export const stringToTemplateLiteral = (string: string): TemplateStringsArray => Object.freeze(
  Object.defineProperties([string], { raw: { value: Object.freeze([string]) } }),
);

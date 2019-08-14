import { Attribute } from './types';

export const attributeName = (attribute: string | Attribute): string => (
  typeof attribute === 'string' ? attribute : attribute.name
);

export const attributeValue = (attribute: string | Attribute, value?: string): string => (
  typeof attribute === 'string' ? value : attribute.converter(value)
);

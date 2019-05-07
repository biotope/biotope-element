import { Attribute } from './types';

export const attributeNameMapper = (attr: string | Attribute): string => (typeof attr === 'string'
  ? attr
  : attr.name);

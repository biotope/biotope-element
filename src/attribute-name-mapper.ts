import { Attribute } from './types';

export const attributeNameMapper = (attr: string | Attribute) => typeof attr === 'string'
  ? attr
  : attr.name;

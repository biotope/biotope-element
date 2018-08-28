import { BioAttribute } from './types';

export const attributeNameMapper = (attr: string|BioAttribute) => typeof attr === 'string' ? attr : attr.name;

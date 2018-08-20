import { BioAttribute } from './types';

export const attributeName = (attr: string|BioAttribute) => typeof attr === 'string' ? attr : attr.name;

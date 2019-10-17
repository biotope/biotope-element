import {
  Attribute, TypedAttribute, ConvertableAttribute, PropValue,
} from './types';
import {
  toBoolean, toNumber, toArray, toObject, toFunction, toString,
} from './attribute-converters';

export const attributeName = (attribute: string | Attribute): string => (
  typeof attribute === 'string' ? attribute : attribute.name
);

export const attributeValue = (attribute: string | Attribute, value?: PropValue): PropValue => {
  if (typeof attribute === 'string') {
    return value;
  }

  if (typeof (attribute as ConvertableAttribute).converter === 'function') {
    return (attribute as ConvertableAttribute).converter(value);
  }

  switch ((attribute as TypedAttribute).type || 'string') {
    case 'boolean':
      return toBoolean(value);
    case 'number':
      return toNumber(value);
    case 'array':
      return toArray(value);
    case 'object':
      return toObject(value);
    case 'function':
      return toFunction(value);
    case 'string':
    default:
      return toString(value);
  }
};

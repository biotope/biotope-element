import { Attribute, TypedAttribute, ConvertableAttribute } from './types';

export const attributeName = (attribute: string | Attribute): string => (
  typeof attribute === 'string' ? attribute : attribute.name
);

const parseAndForceType = (value: string, type: 'array' | 'object'): object => {
  let parsedValue: object;
  try {
    parsedValue = JSON.parse(value);
  } catch (_) {
    parsedValue = undefined;
  }

  if (type === 'array') {
    return typeof parsedValue !== 'object' ? null : Object.keys(parsedValue)
      .reduce(<T>(accumulator: T[], key: string): T[] => ([
        ...accumulator,
        parsedValue[key],
      ]), []);
  }

  return typeof parsedValue !== 'object' ? null : Object.keys(parsedValue)
    .reduce((accumulator: object, key: string): object => ({
      ...accumulator,
      [key]: parsedValue[key],
    }), {});
};

export const attributeValue = (
  attribute: string | Attribute,
  value?: string,
): string | boolean | object | number => {
  if (typeof attribute === 'string') {
    return value;
  }

  if ((attribute as ConvertableAttribute).converter) {
    return (attribute as ConvertableAttribute).converter(value);
  }

  let convertedValue: string | boolean | object | number;
  switch ((attribute as TypedAttribute).type) {
    case 'array':
      convertedValue = parseAndForceType(value, 'array');
      break;
    case 'object':
      convertedValue = parseAndForceType(value, 'object');
      break;
    case 'boolean':
      convertedValue = (!!value && value !== 'false') || value === '';
      break;
    case 'number':
      convertedValue = +value;
      // eslint-disable-next-line no-self-compare
      if (convertedValue !== convertedValue) {
        const float = parseFloat(value);
        convertedValue = float || float === 0 ? float : convertedValue;
      }
      break;
    default:
      convertedValue = value;
      break;
  }
  return convertedValue;
};

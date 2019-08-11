import { Attribute, TypedAttribute, ConvertableAttribute } from './types';

export const attributeName = (attribute: string | Attribute): string => (
  typeof attribute === 'string' ? attribute : attribute.name
);

const arrayReducer = <T>(accumulator: T[], key: string, _: number, original: object): T[] => ([
  ...accumulator,
  original[key],
]);

const objectReducer = (accumulator: object, key: string, _: number, original: object): object => ({
  ...accumulator,
  [key]: original[key],
});

const jsonParse = (value: string, type: 'array' | 'object'): object => {
  let parsedValue: object;
  try {
    parsedValue = JSON.parse(value);
  } catch (_) {
    parsedValue = undefined;
  }

  const reducerFunction = type === 'array' ? arrayReducer : objectReducer;
  const reducerStarter = type === 'array' ? [] : {};

  parsedValue = typeof parsedValue !== 'object' ? null : Object.keys(parsedValue)
    .reduce(reducerFunction, reducerStarter);

  return parsedValue;
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
      convertedValue = jsonParse(value, 'array');
      break;
    case 'object':
      convertedValue = jsonParse(value, 'object');
      break;
    case 'boolean':
      convertedValue = (!!value && value !== 'false') || value === '';
      break;
    case 'number':
      convertedValue = +value;
      break;
    default:
      convertedValue = value;
      break;
  }
  return convertedValue;
};

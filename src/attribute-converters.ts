import { AnyValue } from './types';

const parseOrUndefined = (value: string): object => {
  try {
    return JSON.parse(value);
  } catch (_) {
    return undefined;
  }
};

export const toBoolean = (prop?: AnyValue): boolean => {
  if (typeof prop === 'boolean') {
    return prop;
  }
  return (!!prop && prop !== 'false') || prop === '';
};

export const toNumber = (prop?: AnyValue): number => {
  if (typeof prop === 'number') {
    return prop;
  }
  let convertedProp = +prop;
  // eslint-disable-next-line no-self-compare
  if (convertedProp !== convertedProp) { // if (is NaN)
    const float = parseFloat(prop as string);
    convertedProp = float || float === 0 ? float : convertedProp;
  }
  return convertedProp;
};

export const toArray = <T>(prop?: AnyValue): T[] => {
  if (Array.isArray(prop)) {
    return prop;
  }
  if (typeof prop === 'string') {
    const convertedProp = parseOrUndefined(prop);
    return typeof convertedProp !== 'object' ? null : Object.keys(convertedProp)
      .reduce(<T>(accumulator: T[], key: string): T[] => ([
        ...accumulator,
        convertedProp[key],
      ]), []);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return [...(new Array(prop))] as any[];
};

export const toObject = (prop?: AnyValue): object => {
  if (typeof prop === 'object' && !Array.isArray(prop)) {
    return prop;
  }
  if (typeof prop === 'string') {
    const convertedProp = parseOrUndefined(prop);
    return typeof convertedProp !== 'object' ? null : Object.keys(convertedProp)
      .reduce((accumulator: object, key: string): object => ({
        ...accumulator,
        [key]: convertedProp[key],
      }), {});
  }
  return [...(new Array(prop))].reduce((acc, value, index) => ({ ...acc, [index]: value }), {});
};

export const toFunction = (prop?: AnyValue): Function => {
  if (typeof prop === 'function') {
    return prop;
  }
  try {
    // eslint-disable-next-line no-new-func
    return (new Function(`return ${prop};`))();
  } catch (_) {
    return null;
  }
};

export const toString = (prop?: AnyValue): string => {
  if (typeof prop === 'string') {
    return prop;
  }
  if (!prop) {
    return null;
  }
  return typeof prop.toString === 'function' ? prop.toString() : `${prop}`;
};

import {
  kebabToCamel, camelToKebab, contentToString, stringToTemplateLiteral,
} from '../src/converters';

describe('#kebabToCamel', () => {
  it('converts an empty string', () => {
    expect(kebabToCamel('')).toBe('');
  });

  it('converts single words', () => {
    expect(kebabToCamel('single')).toBe('single');
  });

  it('converts more than one word', () => {
    expect(kebabToCamel('more-than-one-word')).toBe('moreThanOneWord');
  });

  it('converts wrong kebab-cased words', () => {
    expect(kebabToCamel('---more-than-one---word---')).toBe('moreThanOneWord');
  });

  it('throws an error on nulls', () => {
    expect(() => kebabToCamel(null)).toThrow();
    expect(() => kebabToCamel(undefined)).toThrow();
  });
});

describe('#camelToKebab', () => {
  it('converts an empty string', () => {
    expect(camelToKebab('')).toBe('');
  });

  it('converts single words', () => {
    expect(camelToKebab('single')).toBe('single');
  });

  it('converts more than one word', () => {
    expect(camelToKebab('moreThanOneWord')).toBe('more-than-one-word');
  });

  it('converts wrong camel-cased words', () => {
    expect(camelToKebab('MoreThanOneWord')).toBe('more-than-one-word');
  });

  it('throws an error on nulls', () => {
    expect(() => camelToKebab(null)).toThrow();
    expect(() => camelToKebab(undefined)).toThrow();
  });
});

describe('#contentToString', () => {
  it('converts an empty string', () => {
    expect(contentToString('')).toBe('');
  });

  it('converts strings', () => {
    expect(contentToString('single')).toBe('single');
  });

  it('converts objects', () => {
    expect(contentToString(['more', 'than', 'one', 'word'])).toBe('more,than,one,word');
  });

  it('throws an error on nulls', () => {
    expect(contentToString(null)).toBe('null');
    expect(contentToString(undefined)).toBe('undefined');
  });
});

describe('#stringToTemplateLiteral', () => {
  const string = 'simple string';
  let result: TemplateStringsArray;

  beforeEach(() => {
    result = stringToTemplateLiteral(string);
  });

  it('returns an object', () => {
    expect(typeof result).toBe('object');
  });

  it('returns a usable TemplateStringsArray', () => {
    expect(result).toEqual([string]);
  });

  it('contains a raw property', () => {
    expect(result.raw).toEqual([string]);
  });
});

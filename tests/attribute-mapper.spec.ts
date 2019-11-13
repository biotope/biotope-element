import { attributeName, attributeValue } from '../src/attribute-mapper';
import { ConvertibleAttribute, TypedAttribute, SimpleAttribute } from '../src/types';

describe('attribute-mapper', () => {
  const mockAttribute: ConvertibleAttribute = {
    name: 'mock-attribute',
    converter(value: string): string {
      return value;
    },
  };

  describe('#attributeName', () => {
    describe('given a string', () => {
      it('returns the attribute name', () => {
        const result = attributeName(mockAttribute.name);
        expect(result).toBe(mockAttribute.name);
      });
    });

    describe('given an Attribute', () => {
      it('returns the attribute name', () => {
        const result = attributeName(mockAttribute);
        expect(result).toBe(mockAttribute.name);
      });
    });
  });

  describe('#attributeValue', () => {
    describe('given a string', () => {
      it('returns the value', () => {
        const result = attributeValue(mockAttribute.name, 'mock-value');
        expect(result).toBe('mock-value');
      });
    });

    describe('given a ConvertibleAttribute', () => {
      it('returns the converted value', () => {
        const result = attributeValue(mockAttribute, 'mock-value');
        expect(result).toBe('mock-value');
      });
    });

    describe('given a TypedAttribute', () => {
      describe('as the default type', () => {
        const mockStringAttribute: SimpleAttribute = {
          name: 'mock-attribute',
        };

        it('returns the value a string', () => {
          const result = attributeValue(mockStringAttribute, 'mock-value');
          expect(result).toBe('mock-value');
        });

        it('returns the value of its\' toString function', () => {
          const result = attributeValue(mockStringAttribute, {});
          expect(result).toBe('[object Object]');
        });

        it('returns null on non-stringable value', () => {
          const result = attributeValue(mockStringAttribute, { toString: undefined });
          expect(result).toBe(null);
        });

        it('returns null', () => {
          const result = attributeValue(mockStringAttribute, undefined);
          expect(result).toBe(null);
        });
      });

      describe('as string', () => {
        const mockStringAttribute: TypedAttribute = {
          name: 'mock-attribute',
          type: 'string',
        };

        it('returns the value a string', () => {
          const result = attributeValue(mockStringAttribute, 'mock-value');
          expect(result).toBe('mock-value');
        });

        it('returns the value of its\' toString function', () => {
          const result = attributeValue(mockStringAttribute, {});
          expect(result).toBe('[object Object]');
        });

        it('returns null on non-stringable value', () => {
          const result = attributeValue(mockStringAttribute, { toString: undefined });
          expect(result).toBe(null);
        });

        it('returns null', () => {
          const result = attributeValue(mockStringAttribute, undefined);
          expect(result).toBe(null);
        });
      });

      describe('as number', () => {
        const mockNumberAttribute: TypedAttribute = {
          name: 'mock-attribute',
          type: 'number',
        };

        it('parses a raw number attribute', () => {
          const result = attributeValue(mockNumberAttribute, 8);
          expect(result).toBe(8);
        });

        it('parses a simple number', () => {
          const result = attributeValue(mockNumberAttribute, '9');
          expect(result).toBe(9);
        });

        it('parses a negative number', () => {
          const result = attributeValue(mockNumberAttribute, '-9');
          expect(result).toBe(-9);
        });

        it('parses a float', () => {
          const result = attributeValue(mockNumberAttribute, '10.10');
          expect(result).toBe(10.10);
        });

        it('parses a hexadecimal number', () => {
          const result = attributeValue(mockNumberAttribute, '0x10');
          expect(result).toBe(16);
        });

        it('parses a hexadecimal number', () => {
          const result = attributeValue(mockNumberAttribute, '0');
          expect(result).toBe(0);
        });

        it('parses a number with units', () => {
          const result = attributeValue(mockNumberAttribute, '11px');
          expect(result).toBe(11);
        });

        it('parses a number with padding and units', () => {
          const result = attributeValue(mockNumberAttribute, '  12px ');
          expect(result).toBe(12);
        });

        it('parses a raw array', () => {
          const result = attributeValue(mockNumberAttribute, [1, 2, 3]);
          expect(result).toBe(1);
        });

        it('parses a raw object', () => {
          const result = attributeValue(mockNumberAttribute, { a: 'b' });
          expect(result).toBeNaN();
        });

        it('does not parse a value staring with a letter', () => {
          const result = attributeValue(mockNumberAttribute, 'a13');
          expect(result).toBeNaN();
        });

        it('does not parse undefined', () => {
          const result = attributeValue(mockNumberAttribute, undefined);
          expect(result).toBeNaN();
        });
      });

      describe('as boolean', () => {
        const mockBooleanAttribute: TypedAttribute = {
          name: 'mock-attribute',
          type: 'boolean',
        };

        it('parses a raw boolean attribute', () => {
          const result = attributeValue(mockBooleanAttribute, true);
          expect(result).toBe(true);
        });

        it('parses an attribute with no value', () => {
          const result = attributeValue(mockBooleanAttribute, '');
          expect(result).toBe(true);
        });

        it('parses an attribute with "true"', () => {
          const result = attributeValue(mockBooleanAttribute, 'true');
          expect(result).toBe(true);
        });

        it('parses an attribute with jiberish', () => {
          const result = attributeValue(mockBooleanAttribute, 'xrdctfvybgu');
          expect(result).toBe(true);
        });

        it('parses an attribute with an array', () => {
          const result = attributeValue(mockBooleanAttribute, [1]);
          expect(result).toBe(true);
        });

        it('parses an attribute with "false"', () => {
          const result = attributeValue(mockBooleanAttribute, 'false');
          expect(result).toBe(false);
        });

        it('parses an attribute with undefined', () => {
          const result = attributeValue(mockBooleanAttribute, undefined);
          expect(result).toBe(false);
        });
      });

      describe('as object', () => {
        const mockObjectAttribute: TypedAttribute = {
          name: 'mock-attribute',
          type: 'object',
        };

        it('parses a raw object attribute', () => {
          const result = attributeValue(mockObjectAttribute, { a: 'b' });
          expect(result).toEqual({ a: 'b' });
        });

        it('parses an attribute with no value', () => {
          const result = attributeValue(mockObjectAttribute, '');
          expect(result).toBe(null);
        });

        it('parses an attribute with undefined', () => {
          const result = attributeValue(mockObjectAttribute, undefined);
          expect(result).toEqual({ 0: undefined });
        });

        it('parses an attribute with an object as string', () => {
          const result = attributeValue(mockObjectAttribute, '{"a": "b"}');
          expect(result).toEqual({ a: 'b' });
        });

        it('parses an attribute with an array as string', () => {
          const result = attributeValue(mockObjectAttribute, '["a", "b"]');
          expect(result).toEqual({ 0: 'a', 1: 'b' });
        });

        it('parses n raw array attribute', () => {
          const result = attributeValue(mockObjectAttribute, ['b']);
          expect(result).toEqual({ 0: 'b' });
        });
      });

      describe('as array', () => {
        const mockArrayAttribute: TypedAttribute = {
          name: 'mock-attribute',
          type: 'array',
        };

        it('parses a raw array attribute', () => {
          const result = attributeValue(mockArrayAttribute, ['b']);
          expect(result).toEqual(['b']);
        });

        it('parses an attribute with no value', () => {
          const result = attributeValue(mockArrayAttribute, '');
          expect(result).toBe(null);
        });

        it('parses an attribute with undefined', () => {
          const result = attributeValue(mockArrayAttribute, undefined);
          expect(result).toEqual([undefined]);
        });

        it('parses an attribute with an object as string', () => {
          const result = attributeValue(mockArrayAttribute, '{"a": "b"}');
          expect(result).toEqual(['b']);
        });

        it('parses an attribute with an array as string', () => {
          const result = attributeValue(mockArrayAttribute, '["a", "b"]');
          expect(result).toEqual(['a', 'b']);
        });

        it('parses a raw object attribute', () => {
          const result = attributeValue(mockArrayAttribute, { a: 'b' });
          expect(result).toEqual(['b']);
        });
      });

      describe('as function', () => {
        const mockArrayAttribute: TypedAttribute = {
          name: 'mock-attribute',
          type: 'function',
        };

        it('parses a raw function attribute', () => {
          const value = jest.fn();
          const result = attributeValue(mockArrayAttribute, value);
          expect(result).toBe(value);
        });

        it('parses an attribute with no value', () => {
          const result = attributeValue(mockArrayAttribute, '');
          expect(result).toBe(undefined);
        });

        it('parses an attribute with undefined', () => {
          const result = attributeValue(mockArrayAttribute, undefined);
          expect(result).toBe(undefined);
        });

        it('parses an attribute with an object as string', () => {
          const result = attributeValue(mockArrayAttribute, '{"a": "b"}');
          expect(result).toEqual({ a: 'b' });
        });

        it('parses an attribute with an array as string', () => {
          const result = attributeValue(mockArrayAttribute, '["a", "b"]');
          expect(result).toEqual(['a', 'b']);
        });

        it('parses a raw array attribute', () => {
          const result = attributeValue(mockArrayAttribute, ['a', 'b']);
          expect(result).toEqual(null);
        });

        it('parses an attribute with a non-function', () => {
          const result = attributeValue(mockArrayAttribute, 'return');
          expect(result).toBe(null);
        });
      });
    });
  });
});

import { attributeName, attributeValue } from '../src/attribute-mapper';
import { ConvertableAttribute, TypedAttribute } from '../src/types';

describe('attribute-mapper', (): void => {
  const mockAttribute: ConvertableAttribute = {
    name: 'mock-attribute',
    converter(value: string): string {
      return value;
    },
  };

  describe('#attributeName', (): void => {
    describe('given a string', (): void => {
      it('returns the attribute name', (): void => {
        const result = attributeName(mockAttribute.name);
        expect(result).toBe(mockAttribute.name);
      });
    });

    describe('given an Attribute', (): void => {
      it('returns the attribute name', (): void => {
        const result = attributeName(mockAttribute);
        expect(result).toBe(mockAttribute.name);
      });
    });
  });

  describe('#attributeValue', (): void => {
    describe('given a string', (): void => {
      it('returns the value', (): void => {
        const result = attributeValue(mockAttribute.name, 'mock-value');
        expect(result).toBe('mock-value');
      });
    });

    describe('given an ConvertableAttribute', (): void => {
      it('returns the converted value', (): void => {
        const result = attributeValue(mockAttribute, 'mock-value');
        expect(result).toBe('mock-value');
      });
    });

    describe('given an TypedAttribute', (): void => {
      describe('as string', (): void => {
        const mockStringAttribute: TypedAttribute = {
          name: 'mock-attribute',
          type: 'string',
        };

        it('returns the value as is', (): void => {
          const result = attributeValue(mockStringAttribute, 'mock-value');
          expect(result).toBe('mock-value');
        });

        it('returns undefined', (): void => {
          const result = attributeValue(mockStringAttribute, undefined);
          expect(result).toBe(undefined);
        });
      });

      describe('as number', (): void => {
        const mockNumberAttribute: TypedAttribute = {
          name: 'mock-attribute',
          type: 'number',
        };

        it('parses a simple number', (): void => {
          const result = attributeValue(mockNumberAttribute, '9');
          expect(result).toBe(9);
        });

        it('parses a negative number', (): void => {
          const result = attributeValue(mockNumberAttribute, '-9');
          expect(result).toBe(-9);
        });

        it('parses a float', (): void => {
          const result = attributeValue(mockNumberAttribute, '10.10');
          expect(result).toBe(10.10);
        });

        it('parses a hexadecimal number', (): void => {
          const result = attributeValue(mockNumberAttribute, '0x10');
          expect(result).toBe(16);
        });

        it('parses a hexadecimal number', (): void => {
          const result = attributeValue(mockNumberAttribute, '0');
          expect(result).toBe(0);
        });

        it('parses a number with units', (): void => {
          const result = attributeValue(mockNumberAttribute, '11px');
          expect(result).toBe(11);
        });

        it('parses a number with padding and units', (): void => {
          const result = attributeValue(mockNumberAttribute, '  12px ');
          expect(result).toBe(12);
        });

        it('does not parse a value staring with a letter', (): void => {
          const result = attributeValue(mockNumberAttribute, 'a13');
          expect(result).toBeNaN();
        });

        it('does not parse undefined', (): void => {
          const result = attributeValue(mockNumberAttribute, undefined);
          expect(result).toBeNaN();
        });
      });

      describe('as boolean', (): void => {
        const mockBooleanAttribute: TypedAttribute = {
          name: 'mock-attribute',
          type: 'boolean',
        };

        it('parses an attribute with no value', (): void => {
          const result = attributeValue(mockBooleanAttribute, '');
          expect(result).toBe(true);
        });

        it('parses an attribute with "true"', (): void => {
          const result = attributeValue(mockBooleanAttribute, 'true');
          expect(result).toBe(true);
        });

        it('parses an attribute with jiberish', (): void => {
          const result = attributeValue(mockBooleanAttribute, 'xrdctfvybgu');
          expect(result).toBe(true);
        });

        it('parses an attribute with "false"', (): void => {
          const result = attributeValue(mockBooleanAttribute, 'false');
          expect(result).toBe(false);
        });

        it('parses an attribute with undefined', (): void => {
          const result = attributeValue(mockBooleanAttribute, undefined);
          expect(result).toBe(false);
        });
      });

      describe('as object', (): void => {
        const mockObjectAttribute: TypedAttribute = {
          name: 'mock-attribute',
          type: 'object',
        };

        it('parses an attribute with no value', (): void => {
          const result = attributeValue(mockObjectAttribute, '');
          expect(result).toEqual(null);
        });

        it('parses an attribute with undefined', (): void => {
          const result = attributeValue(mockObjectAttribute, undefined);
          expect(result).toBe(null);
        });

        it('parses an attribute with an object', (): void => {
          const result = attributeValue(mockObjectAttribute, '{"a": "b"}');
          expect(result).toEqual({ a: 'b' });
        });

        it('parses an attribute with an array', (): void => {
          const result = attributeValue(mockObjectAttribute, '["a", "b"]');
          expect(result).toEqual({ 0: 'a', 1: 'b' });
        });
      });

      describe('as array', (): void => {
        const mockArrayAttribute: TypedAttribute = {
          name: 'mock-attribute',
          type: 'array',
        };

        it('parses an attribute with no value', (): void => {
          const result = attributeValue(mockArrayAttribute, '');
          expect(result).toEqual(null);
        });

        it('parses an attribute with undefined', (): void => {
          const result = attributeValue(mockArrayAttribute, undefined);
          expect(result).toBe(null);
        });

        it('parses an attribute with an object', (): void => {
          const result = attributeValue(mockArrayAttribute, '{"a": "b"}');
          expect(result).toEqual(['b']);
        });

        it('parses an attribute with an array', (): void => {
          const result = attributeValue(mockArrayAttribute, '["a", "b"]');
          expect(result).toEqual(['a', 'b']);
        });
      });
    });
  });
});

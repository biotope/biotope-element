import { attributeName, attributeValue } from '../src/attribute-mapper';
import { Attribute } from '../src/types';

describe('attribute-mapper', (): void => {
  const mockAttribute: Attribute = {
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

    describe('given an Attribute', (): void => {
      it('returns the converted value', (): void => {
        const result = attributeValue(mockAttribute, 'mock-value');
        expect(result).toBe('mock-value');
      });
    });
  });
});

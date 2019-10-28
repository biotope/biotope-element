import { getComponentName } from '../src/get-component-name';
import { ComponentType } from '../src/internal-types';

describe('#getComponentName', () => {
  let component: Function;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    component = function MockName(): void {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).componentName = 'mock-component-name';
  });

  describe('componentName exists', () => {
    it('returns the attribute name', () => {
      const result = getComponentName(component as ComponentType);
      expect(result).toBe('mock-component-name');
    });
  });

  describe('componentName does not exist', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).componentName = '';
    });

    it('returns the kebab function name', () => {
      const result = getComponentName(component as ComponentType);
      expect(result).toBe('mock-name');
    });
  });

  describe('componentName and function name do not exist', () => {
    it('returns the kebab function name', () => {
      const result = getComponentName({
        toString: (): string => 'function MockFunctionName() {}',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      expect(result).toBe('mock-function-name');
    });
  });
});

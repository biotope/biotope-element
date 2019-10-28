import { register } from '../src/register';
import { ComponentType, ComponentInstance } from '../src/internal-types';

describe('#register', (): void => {
  let mockComponentClass;
  let mockDependency;
  let mockFunction;
  let originalCreateElement: typeof document.createElement;
  let originalCustomElementsDefine: typeof customElements.define;
  let result: boolean;

  beforeEach((): void => {
    originalCreateElement = document.createElement;
    originalCustomElementsDefine = customElements.define;
    customElements.define = jest.fn();
    mockFunction = jest.fn();

    mockDependency = {
      register: jest.fn(),
    };

    mockComponentClass = {
      componentName: 'mock-name',
      dependencies: [
        mockDependency,
        mockDependency,
      ],
      attributes: ['first', 'and-second'],
      prototype: {
        props: { first: 1, andSecond: 2 },
        connectedCallback: mockFunction,
        attributeChangedCallback: mockFunction,
        render: mockFunction,
        __initCallStack: [mockDependency.register],
        __initAttributesCallStack: [mockDependency.register],
      },
    };
  });

  afterEach((): void => {
    document.createElement = originalCreateElement;
    customElements.define = originalCustomElementsDefine;
  });

  describe('silent is false', (): void => {
    let originalConsoleWarn: typeof console.warn;

    beforeEach((): void => {
      // eslint-disable-next-line no-console
      originalConsoleWarn = console.warn;
      // eslint-disable-next-line no-console
      console.warn = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.createElement = jest.fn((): any => ({ constructor: null }));

      mockComponentClass.name = mockComponentClass.componentName;
      mockComponentClass.componentName = '';
      result = register(mockComponentClass, false);
    });

    afterEach((): void => {
      // eslint-disable-next-line no-console
      console.warn = originalConsoleWarn;
    });

    it('calls console.warn twice', (): void => {
      // eslint-disable-next-line no-console
      expect((console.warn as jest.Mock).mock.calls).toHaveLength(2);
    });
  });

  describe('silent is true', (): void => {
    describe('componentName exists', (): void => {
      describe('not registered', (): void => {
        describe('component has attributes', () => {
          beforeEach((): void => {
            result = register(mockComponentClass, true);
          });

          it('calls the dependencies\' register and calls all stacked callbacks', (): void => {
            (mockComponentClass as ComponentType).prototype.attributeChangedCallback('', '', '');
            (mockComponentClass as ComponentType).prototype.connectedCallback();

            expect(((mockDependency as ComponentType).register as jest.Mock).mock.calls)
              .toHaveLength(4);
          });

          it('attributeChangedCallback is called directly when no callback stacks exist', (): void => {
            // eslint-disable-next-line no-underscore-dangle
            (mockComponentClass as ComponentInstance).prototype.__initCallStack = [];
            (mockComponentClass as ComponentType).prototype.attributeChangedCallback('', '', '');

            expect(((mockDependency as ComponentType).register as jest.Mock).mock.calls)
              .toHaveLength(2);
          });

          it('prop getters were set', () => {
            expect(mockComponentClass.prototype.first).toBe(1);
            expect(mockComponentClass.prototype.andSecond).toBe(2);
            expect(mockComponentClass.prototype['and-second']).toBe(2);
          });

          it('prop setters were set', () => {
            // eslint-disable-next-line no-underscore-dangle
            (mockComponentClass as ComponentInstance).prototype.__initCallStack = [];
            mockComponentClass.prototype.first = 3;

            expect(mockFunction.mock.calls).toHaveLength(1);
            expect(mockFunction.mock.calls[0]).toEqual(['first', 1, 3]);
          });

          it('calls the customElements.define method', (): void => {
            const { calls } = (customElements.define as jest.Mock).mock;

            expect(calls).toHaveLength(1);
            expect(calls[0][0]).toBe(mockComponentClass.componentName);
            expect(calls[0][1]).toBe(mockComponentClass);
          });

          it('returns true', (): void => {
            expect(result).toBeTruthy();
          });
        });

        describe('component has no attributes', () => {
          beforeEach((): void => {
            mockComponentClass.attributes = [];
            result = register(mockComponentClass, true);
          });

          it('calls the dependencies\' register', (): void => {
            expect((mockComponentClass as ComponentType).observedAttributes).toHaveLength(0);
          });
        });
      });

      describe('is registered', (): void => {
        beforeEach((): void => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          document.createElement = jest.fn((): any => ({ constructor: null }));
          result = register(mockComponentClass, true);
        });

        it('does not call the dependencies\' register', (): void => {
          expect(mockDependency.register.mock.calls).toHaveLength(0);
        });

        it('does not call the define method', (): void => {
          expect((customElements.define as jest.Mock).mock.calls).toHaveLength(0);
        });

        it('returns false', (): void => {
          expect(result).toBeFalsy();
        });
      });
    });

    describe('componentName does not exist', (): void => {
      beforeEach((): void => {
        mockComponentClass.name = mockComponentClass.componentName;
        mockComponentClass.componentName = '';
        result = register(mockComponentClass, true);
      });

      it('sets the componentName', (): void => {
        expect(mockComponentClass.componentName).toBe(mockComponentClass.name);
      });

      it('returns true', (): void => {
        expect(result).toBeTruthy();
      });
    });
  });
});

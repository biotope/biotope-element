import { register } from '../src/register';

describe('#register', (): void => {
  let mockComponentClass;
  let mockDependency;
  let originalCreateElement;
  let originalCustomElementsDefine;
  let result;

  beforeEach((): void => {
    originalCreateElement = document.createElement;
    originalCustomElementsDefine = customElements.define;
    customElements.define = jest.fn();

    mockDependency = {
      register: jest.fn(),
    };

    mockComponentClass = {
      componentName: 'mock-name',
      basedOn: 'mock-component',
      dependencies: [
        mockDependency,
        mockDependency,
      ],
      prototype: {
        connectedCallback: jest.fn(),
        attributeChangedCallback: jest.fn(),
      },
    };
  });

  afterEach((): void => {
    document.createElement = originalCreateElement;
    customElements.define = originalCustomElementsDefine;
  });

  describe('silent is false', (): void => {
    let originalConsoleWarn;

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
        describe('component is based on native element', (): void => {
          beforeEach((): void => {
            result = register(mockComponentClass, true);
          });

          it('calls the dependencies\' register', (): void => {
            expect(mockDependency.register.mock.calls).toHaveLength(2);
          });

          it('calls the customElements.define method', (): void => {
            const { calls } = (customElements.define as jest.Mock).mock;

            expect(calls).toHaveLength(1);
            expect(calls[0][0]).toBe(mockComponentClass.componentName);
            expect(calls[0][1]).toBe(mockComponentClass);
            expect(calls[0][2].extends).toBe(mockComponentClass.basedOn);
          });

          it('returns true', (): void => {
            expect(result).toBeTruthy();
          });
        });

        describe('component is not based on native element', (): void => {
          beforeEach((): void => {
            mockComponentClass.basedOn = '';
            result = register(mockComponentClass, true);
          });

          it('calls the define method without "extends"', (): void => {
            const { calls } = (customElements.define as jest.Mock).mock;

            expect(calls).toHaveLength(1);
            expect(calls[0][0]).toBe(mockComponentClass.componentName);
            expect(calls[0][1]).toBe(mockComponentClass);
            expect(calls[0][2].extends).toBeUndefined();
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

import Component from '../src/index';

const { register } = Component;

describe('#register', (): void => {
  let mockComponentClass;
  let mockDependency;
  let mockRegister;
  let originalCreateElement;
  let result;

  beforeEach((): void => {
    originalCreateElement = document.createElement;

    const dependencyRegister = jest.fn();
    mockDependency = {
      register: dependencyRegister,
    };

    mockComponentClass = {
      componentName: 'mock-name',
      basedOn: 'mock-component',
      dependencies: [
        mockDependency,
        mockDependency,
      ],
      define: jest.fn(),
    };

    mockRegister = register.bind(mockComponentClass);
  });

  afterEach((): void => {
    document.createElement = originalCreateElement;
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
      result = mockRegister(false);
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
            result = mockRegister();
          });

          it('calls the dependencies\' register', (): void => {
            expect(mockDependency.register.mock.calls).toHaveLength(2);
          });

          it('calls the define method', (): void => {
            const { calls } = mockComponentClass.define.mock;

            expect(calls).toHaveLength(1);
            expect(calls[0][0]).toBe(mockComponentClass.componentName);
            expect(calls[0][1].extends).toBe(mockComponentClass.basedOn);
          });

          it('returns true', (): void => {
            expect(result).toBeTruthy();
          });
        });

        describe('component is not based on native element', (): void => {
          beforeEach((): void => {
            mockComponentClass.basedOn = '';
            result = mockRegister();
          });

          it('calls the define method without "extends"', (): void => {
            const { calls } = mockComponentClass.define.mock;

            expect(calls).toHaveLength(1);
            expect(calls[0][0]).toBe(mockComponentClass.componentName);
            expect(calls[0][1].extends).toBeUndefined();
          });
        });
      });

      describe('is registered', (): void => {
        beforeEach((): void => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          document.createElement = jest.fn((): any => ({ constructor: null }));
          result = mockRegister();
        });

        it('does not call the dependencies\' register', (): void => {
          expect(mockDependency.register.mock.calls).toHaveLength(0);
        });

        it('does not call the define method', (): void => {
          expect(mockComponentClass.define.mock.calls).toHaveLength(0);
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
        result = mockRegister();
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

import { isRegistered } from '../src/is-registered';

describe('#isRegistered', (): void => {
  describe('constructor is HTMLElement', (): void => {
    beforeEach((): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.createElement = jest.fn((): any => ({ constructor: HTMLElement }));
    });

    it('element to be created with given tag', (): void => {
      isRegistered('mock-name');
      expect((document.createElement as jest.Mock).mock.calls[0][0]).toBe('mock-name');
    });

    it('returns false', (): void => {
      expect(isRegistered('mock-name')).toBeFalsy();
    });
  });

  describe('constructor is HTMLUnknownElement', (): void => {
    beforeEach((): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.createElement = jest.fn((): any => ({ constructor: HTMLUnknownElement }));
    });

    it('returns true', (): void => {
      expect(isRegistered('mock-name')).toBeFalsy();
    });
  });

  describe('constructor is not HTMLElement nor HTMLUnknownElement', (): void => {
    beforeEach((): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.createElement = jest.fn((): any => ({ constructor: null }));
    });

    it('returns true', (): void => {
      expect(isRegistered('mock-name')).toBeTruthy();
    });
  });
});

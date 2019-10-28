import { isRegistered } from '../src/is-registered';

describe('#isRegistered', () => {
  describe('constructor is HTMLElement', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.createElement = jest.fn((): any => ({ constructor: HTMLElement }));
    });

    it('element to be created with given tag', () => {
      isRegistered('mock-name');
      expect((document.createElement as jest.Mock).mock.calls[0][0]).toBe('mock-name');
    });

    it('returns false', () => {
      expect(isRegistered('mock-name')).toBeFalsy();
    });
  });

  describe('constructor is HTMLUnknownElement', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.createElement = jest.fn((): any => ({ constructor: HTMLUnknownElement }));
    });

    it('returns true', () => {
      expect(isRegistered('mock-name')).toBeFalsy();
    });
  });

  describe('constructor is not HTMLElement nor HTMLUnknownElement', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.createElement = jest.fn((): any => ({ constructor: null }));
    });

    it('returns true', () => {
      expect(isRegistered('mock-name')).toBeTruthy();
    });
  });
});

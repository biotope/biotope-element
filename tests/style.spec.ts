import { createStyle } from '../src/style';

describe('#createStyle', (): void => {
  beforeEach((): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    document.createElement = jest.fn((): any => ({ innerHTML: undefined }));
  });

  describe('is given a string', (): void => {
    it('sets innerHTML to it', (): void => {
      const result = createStyle('mock-style');
      expect(result.innerHTML).toBe('mock-style');
    });
  });

  describe('is not given a string', (): void => {
    it('sets innerHTML to the result of ".toString()"', (): void => {
      const styles = {};
      styles.toString = (): string => 'mock-style';
      const result = createStyle(styles);
      expect(result.innerHTML).toBe('mock-style');
    });
  });
});

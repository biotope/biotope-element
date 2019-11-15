import { HTMLElementContent } from '../src/types';
import { createStyle } from '../src/create-style';

jest.mock('../src/create-html', (): object => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  html: jest.fn((template: TemplateStringsArray, ...args: any[]) => template
    .reduce((accumulator, hole, index) => `${accumulator}${hole}${args.length - 1 >= index ? args[index] : ''}`, '')),
}));

const createStyleRetyped = (style: HTMLElementContent): string => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createStyle(style) as any as string
);

describe('#createStyle', (): void => {
  describe('is given a string', (): void => {
    it('sets innerHTML to it', (): void => {
      const result = createStyleRetyped('mock-style').trim();
      expect(result).toBe('<style>mock-style</style>');
    });
  });

  describe('is not given a string', (): void => {
    it('sets innerHTML to the result of ".toString()"', (): void => {
      const styles = {};
      styles.toString = (): string => 'mock-style';

      const result = createStyleRetyped(styles).trim();
      expect(result).toBe('<style>mock-style</style>');
    });
  });
});

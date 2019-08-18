import { createRef } from '../src';

describe('#refs', (): void => {
  it('creates an object', (): void => {
    const result = createRef<string>();
    expect(result).toBeTruthy();
  });

  it('creates a reference object', (): void => {
    const { current } = createRef<string>();
    expect(current).toBeNull();
  });

  it('the object is assignable', (): void => {
    const result = createRef<string>();
    result.current = 'mock-string';
    expect(result.current).toBe('mock-string');
  });
});

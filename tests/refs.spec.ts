import { createRef } from '../src';

describe('#refs', () => {
  it('creates an object', () => {
    const result = createRef<string>();
    expect(result).toBeTruthy();
  });

  it('creates a reference object', () => {
    const { current } = createRef<string>();
    expect(current).toBeNull();
  });

  it('the object is assignable', () => {
    const result = createRef<string>();
    result.current = 'mock-string';
    expect(result.current).toBe('mock-string');
  });
});

import { createRef, createRefCallback } from '../src';

describe('#createRef', () => {
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

describe('#createRefCallback', () => {
  let mockGetter: () => string;

  beforeEach(() => {
    mockGetter = jest.fn(() => 'mock-string');
  });

  it('creates an object', () => {
    const result = createRefCallback<string>(mockGetter);
    expect(result).toBeTruthy();
  });

  it('creates a reference object already filled', () => {
    const { current } = createRefCallback<string>(mockGetter);
    expect(current).toBe('mock-string');
  });

  it('the object is not assignable', () => {
    const result = createRefCallback<string>(mockGetter);
    let caughtError: Error;

    try {
      result.current = 'mock-string-2';
    } catch (error) {
      caughtError = error;
    }
    expect(caughtError).toBeTruthy();
  });
});

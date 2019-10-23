import Component from '../src';

describe('#emit', () => {
  let element: Component;

  beforeEach(() => {
    class TestElement extends Component {
      public static componentName = 'test-element';
    }
    element = new TestElement();
    element.dispatchEvent = jest.fn();
  });

  it('throws error for undefined event name', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => (element as any).emit(undefined)).toThrowError();
  });

  describe('detail', () => {
    let customEvent: CustomEvent;

    describe('is not given', () => {
      beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (element as any).emit('mock-name');
        customEvent = (element.dispatchEvent as jest.Mock).mock.calls[0][0] as CustomEvent;
      });

      it('emits a custom event with the given name', () => {
        expect(customEvent.type).toBe('mock-name');
      });

      it('emits a custom event without detail', () => {
        expect(customEvent.detail).toBeUndefined();
      });
    });

    describe('is given', () => {
      beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (element as any).emit('mock-name', 'mock-detail');
        customEvent = (element.dispatchEvent as jest.Mock).mock.calls[0][0] as CustomEvent<string>;
      });

      it('emits a custom event with detail', () => {
        expect(customEvent.detail).toBe('mock-detail');
      });

      it('emits a custom event with bubbles', () => {
        expect(customEvent.bubbles).toBeTruthy();
      });
    });
  });

  describe('addPrefix is true', () => {
    let customEvent: CustomEvent;

    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (element as any).emit('mock-name', 'mock-detail', true);
      customEvent = (element.dispatchEvent as jest.Mock).mock.calls[0][0] as CustomEvent<string>;
    });

    it('emits a custom event with a prefixed name', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(customEvent.type).toBe(`${(element.constructor as any).componentName}-mock-name`);
    });

    it('emits a custom event with detail', () => {
      expect(customEvent.detail).toBe('mock-detail');
    });
  });
});

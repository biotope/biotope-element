import Component from '../src/index';

describe('#emit', (): void => {
  let element: Component;

  beforeEach((): void => {
    class TestElement extends Component {
      public static componentName = 'test-element';
    }
    element = new TestElement();
    element.dispatchEvent = jest.fn();
  });

  it('throws error for undefined event name', (): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((): void => (element as any).emit(undefined)).toThrowError();
  });

  describe('detail', (): void => {
    let customEvent: CustomEvent;

    describe('is not given', (): void => {
      beforeEach((): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (element as any).emit('mock-name');
        customEvent = (element.dispatchEvent as jest.Mock).mock.calls[0][0] as CustomEvent;
      });

      it('emits a custom event with the given name', (): void => {
        expect(customEvent.type).toBe('mock-name');
      });

      it('emits a custom event without detail', (): void => {
        expect(customEvent.detail).toBeUndefined();
      });
    });

    describe('is given', (): void => {
      beforeEach((): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (element as any).emit('mock-name', 'mock-detail');
        customEvent = (element.dispatchEvent as jest.Mock).mock.calls[0][0] as CustomEvent<string>;
      });

      it('emits a custom event with detail', (): void => {
        expect(customEvent.detail).toBe('mock-detail');
      });

      it('emits a custom event with bubbles', (): void => {
        expect(customEvent.bubbles).toBeTruthy();
      });
    });
  });

  describe('addPrefix is true', (): void => {
    let customEvent: CustomEvent;

    beforeEach((): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (element as any).emit('mock-name', 'mock-detail', true);
      customEvent = (element.dispatchEvent as jest.Mock).mock.calls[0][0] as CustomEvent<string>;
    });

    it('emits a custom event with a prefixed name', (): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(customEvent.type).toBe(`${(element.constructor as any).componentName}-mock-name`);
    });

    it('emits a custom event with detail', (): void => {
      expect(customEvent.detail).toBe('mock-detail');
    });
  });
});

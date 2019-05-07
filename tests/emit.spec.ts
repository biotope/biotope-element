import Component from '../src/index';

describe('emit', (): void => {
  let element: Component;

  beforeEach((): void => {
    class TestElement extends Component {
      public static componentName = 'my-comp';
    }

    element = new TestElement();
  });

  it('Throws error for undefined event name', (): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((): void => (element as any).emit(undefined)).toThrowError();
  });
});

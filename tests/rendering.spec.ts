import Component from '../src/index';

describe('render', (): void => {
  it('is called on created', (): void => {
    const renderSpy = jest.fn();
    class HelloWorld extends Component {
      public static componentName = 'x-world';

      public render = renderSpy;
    }

    const instance = new HelloWorld();
    instance.created();

    expect(renderSpy.mock.calls.length).toBe(1);
  });

  it('is called onPropsChanged by default', (): void => {
    const renderSpy = jest.fn();
    class HelloWorld extends Component {
      public static componentName = 'x-world';

      public render = renderSpy;
    }

    const instance = new HelloWorld();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (instance as any).onPropsChanged();

    expect(renderSpy.mock.calls.length).toBe(1);
  });
});

import Component from '../src/index';

describe('#partial', (): void => {
  it('calls the wire function', (): void => {
    class TestElement extends Component {
      public static componentName = 'test-element';
    }
    const element = new TestElement();
    const wireResult = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Component as any).wire = jest.fn((): jest.Mock => wireResult);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((element as any).partial).toBe(wireResult);
  });
});

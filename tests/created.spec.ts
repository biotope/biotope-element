import Component from '../src/index';

describe('#created', (): void => {
  it('calls the render function', (): void => {
    class TestElement extends Component {
      public static componentName = 'test-element';
    }
    const element = new TestElement();
    element.render = jest.fn();
    element.created();

    expect((element.render as jest.Mock).mock.calls).toHaveLength(1);
  });
});

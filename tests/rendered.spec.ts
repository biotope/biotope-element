import Component from '../src/index';

describe('#rendered', (): void => {
  let element: Component;
  let mockRendered;
  let result;

  beforeEach((): void => {
    mockRendered = jest.fn();

    class TestElement extends Component {
      public static componentName = 'test-element';

      public render(): TestElement {
        return this;
      }

      public rendered = mockRendered;
    }
    element = new TestElement();
    result = element.render();
  });

  it('calls the defined render method', (): void => {
    expect(result).toBe(element);
  });

  it('calls the defined render method', (): void => {
    expect((element.rendered as jest.Mock).mock.calls).toHaveLength(1);
  });

  describe('no render method is given', (): void => {
    beforeEach((): void => {
      mockRendered = jest.fn();

      class TestElement extends Component {
        public static componentName = 'test-element';

        public rendered = mockRendered;
      }
      element = new TestElement();
      element.html = jest.fn();
      result = element.render();
    });

    it('calls the default render method', (): void => {
      expect((element.html as jest.Mock).mock.calls).toHaveLength(1);
    });

    it('triggers rendered', (): void => {
      expect((element.rendered as jest.Mock).mock.calls).toHaveLength(1);
    });
  });
});

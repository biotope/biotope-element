import Component from '../src';

describe('#shadowRoot', (): void => {
  it('adds shadowRoot by default', (): void => {
    class TestElement extends Component {
      public static componentName = 'test-element';
    }
    const element = new TestElement();

    expect(element.shadowRoot).toBeTruthy();
  });

  it('can disable shadow root', (): void => {
    class TestElement extends Component {
      public static componentName = 'test-element';

      public constructor() {
        super(false);
      }
    }

    const element = new TestElement();

    expect(element.shadowRoot).toBeUndefined();
  });
});

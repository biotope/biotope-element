import Component from '../src';

describe('#shadowRoot', () => {
  it('adds shadowRoot by default', () => {
    class HelloWorld extends Component<object, object> {
      public static componentName = 'x-world';
    }

    const element = new HelloWorld();

    expect(element.shadowRoot).toBeDefined();
  });

  it('can disable shadow root', () => {
    class HelloWorld extends Component<object, object> {
      public static componentName = 'x-world';

      constructor() {
        super(false);
      }
    }

    const element = new HelloWorld();

    expect(element.shadowRoot).toBeUndefined();
  });
});

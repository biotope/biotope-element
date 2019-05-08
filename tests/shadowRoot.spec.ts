import Component from '../src';

describe('#shadowRoot', (): void => {
  it('adds shadowRoot by default', (): void => {
    class HelloWorld extends Component {
      public static componentName = 'x-world';
    }

    const element = new HelloWorld();

    expect(element.shadowRoot).toBeDefined();
  });

  it('can disable shadow root', (): void => {
    class HelloWorld extends Component {
      public static componentName = 'x-world';

      public constructor() {
        super(false);
      }
    }

    const element = new HelloWorld();

    expect(element.shadowRoot).toBeUndefined();
  });
});

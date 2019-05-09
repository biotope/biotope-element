import Component from '../src';

describe('#Extending HTMLElements', (): void => {
  // register an extended set on HTMLElements
  beforeEach((): void => {
    // eslint-disable-next-line global-require
    const basicHTML = require('basichtml');
    // eslint-disable-next-line global-require
    const basicHTMLElements = require('basichtml-elements');
    const customElements = new basicHTML.CustomElementRegistry();

    // define things
    basicHTMLElements.defineOnRegistry(customElements);

    basicHTML.init({
      window: global,
      customElements,
    });
  });

  it('extends non builtin element and check against HTMLElement', (): void => {
    class TestComponent extends Component<object, object> {
      public static componentName = 'test-component';
    }

    TestComponent.register();

    const element = new TestComponent();
    expect(element).toBeInstanceOf(HTMLElement);
  });

  it('extends a button element and check against HTMLElement', (): void => {
    class TestButton extends Component<object, object> {
      public static componentName = 'test-button';

      public static basedOn = 'button';
    }

    TestButton.register();

    const element = new TestButton();
    expect(element).toBeInstanceOf(HTMLElement);
  });

  it('extends a button element and check against default button', (): void => {
    class TestButton extends Component<object, object> {
      public static componentName = 'test-button';

      public static basedOn = 'button';
    }

    TestButton.register();

    const element = new (customElements.get('test-button'))();
    expect(element).toBeInstanceOf(customElements.get('button'));
  });

  it('extends a button element and check against input field', (): void => {
    class TestButton extends Component<object, object> {
      public static componentName = 'test-button';

      public static basedOn = 'button';
    }

    TestButton.register();

    const element = new (customElements.get('test-button'))();
    expect(element).not.toBeInstanceOf(customElements.get('input'));
  });
});

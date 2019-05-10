import basicHTML from 'basichtml';
import basicHTMLElements from 'basichtml-elements';
import Component from '../src';

describe('#basedOn builtin HTMLElements', (): void => {
  // register an extended set on HTMLElements
  beforeEach((): void => {
    const customElements = new basicHTML.CustomElementRegistry();

    basicHTMLElements.defineOnRegistry(customElements);

    basicHTML.init({
      window: global,
      customElements,
    });
  });

  it('extends HTMLElement by default', (): void => {
    class TestComponent extends Component {
      public static componentName = 'test-component';
    }

    TestComponent.register();

    const element = new TestComponent();
    expect(element).toBeInstanceOf(HTMLElement);
  });

  it('extends a button element and check against HTMLElement', (): void => {
    class TestButton extends Component {
      public static componentName = 'test-button';

      public static basedOn = 'button';
    }

    TestButton.register();

    const element = new TestButton();
    expect(element).toBeInstanceOf(HTMLElement);
  });

  it('extends a button element and check against default button', (): void => {
    class TestButton extends Component {
      public static componentName = 'test-button';

      public static basedOn = 'button';
    }

    TestButton.register();

    const element = new (customElements.get('test-button'))();
    expect(element).toBeInstanceOf(customElements.get('button'));
  });

  it('extends an input element and check against the builtin input field', (): void => {
    class TestInput extends Component {
      public static componentName = 'test-input';

      public static basedOn = 'input';
    }

    TestInput.register();

    const element = new (customElements.get('test-input'))();
    expect(element).toBeInstanceOf(customElements.get('input'));
  });
});

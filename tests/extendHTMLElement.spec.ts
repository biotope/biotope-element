import Component from '../src';

describe('#Extending HTMLElements', () => {

  // register an extended set on HTMLElements 
  beforeEach(() => {

    const basicHTML = require('basichtml');
    const basicHTMLElements = require('basichtml-elements');
    const customElements = new basicHTML.CustomElementRegistry();

    // define things
    basicHTMLElements.defineOnRegistry(customElements);
    
    basicHTML.init({
      window: global,
      customElements
    });

  });

  it('extends non builtin element and check against HTMLElement', () => {

    class TestComponent extends Component<object, object> {
      public static componentName = 'test-component';
    }
    
    TestComponent.register()

    const element = new TestComponent();
    expect(element).toBeInstanceOf(HTMLElement);

  });

  it('extends a button element and check against HTMLElement', () => {

    class TestButton extends Component<object, object> {
      public static componentName = 'test-button';
      public static basedOn = 'button';
    }

    TestButton.register();
    
    const element = new TestButton();
    expect(element).toBeInstanceOf(HTMLElement);

  });

  it('extends a button element and check against default button', () => {
   
    class TestButton extends Component<object, object> {
      public static componentName = 'test-button';
      public static basedOn = 'button';
    }
    
    TestButton.register();

    const element = new (customElements.get('test-button'));
    expect(element).toBeInstanceOf(customElements.get('button'));

  });

  it('extends a button element and check against input field', () => {
   
    class TestButton extends Component<object, object> {
      public static componentName = 'test-button';
      public static basedOn = 'button';
    }
    
    TestButton.register();

    const element = new (customElements.get('test-button'));
    expect(element).not.toBeInstanceOf(customElements.get('input'));

  });
});

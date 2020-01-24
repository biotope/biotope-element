/* eslint-disable max-classes-per-file */
import Component, {HTMLFragment} from '../src';

const mockRegister = (element: any): void => {
  // eslint-disable-next-line no-underscore-dangle,no-param-reassign
  element.__created = true;
};

describe('#autoStyles', (): void => {
  let element: Component;

  // beforeEach((): void => {
  //   class TestElement extends Component<any, any> {
  //     public static componentName = 'test-element';
    
  //     public render(): HTMLFragment {
  //       return this.html`Simple Content`;
  //     }
  //   }
  //   element = new TestElement();
  //   mockRegister(element);
  //   element.render();
  // });

  it('writes no styles if none defined', (): void => {
    class TestElement extends Component<any, any> {
      public static componentName = 'test-element';
    
      public render(): HTMLFragment {
        return this.html`Simple Content`;
      }
    }
    element = new TestElement();
    mockRegister(element);
    element.render();

    expect(element.shadowRoot.innerHTML).not.toContain('style');
  });

  it('writes styles if defined', (): void => {
    class TestElement extends Component<any, any> {
      public static componentName = 'test-element';

      public styles = `html {
        color: blue;
      }`
    
      public render(): HTMLFragment {
        return this.html`Simple Content`;
      }
    }
    element = new TestElement();
    mockRegister(element);
    element.render();
    expect(element.shadowRoot.innerHTML).toContain('<style>');
  });

  it('adds styles to existing', (): void => {
    class TestElement extends Component<any, any> {
      public static componentName = 'test-element';

      public styles = `html {
        color: blue;
      }`
    
      public render(): HTMLFragment {
        return this.html`Simple Content${this.createStyle('html {background-color: black}')}`;
      }
    }
    element = new TestElement();
    mockRegister(element);
    element.render();
    expect(element.shadowRoot.innerHTML.match(new RegExp('<style>', 'g'))).toHaveLength(2);
  });

  it('does not add styles more than once', (): void => {
    class TestElement extends Component<any, any> {
      public static componentName = 'test-element';

      public styles = `html {
        color: blue;
      }`
    
      public render(): HTMLFragment {
        return this.html`Simple Content`;
      }
    }
    element = new TestElement();
    mockRegister(element);
    element.render();
    element.render();
    expect(element.shadowRoot.innerHTML.match(new RegExp('<style>', 'g'))).toHaveLength(1);
  });

  it('causes rerender on styles change', (): void => {
    const mockRender = jest.fn();
    class TestElement extends Component<any, any> {
      public static componentName = 'test-element';

      public styles = `html {
        color: blue;
      }`;

      public changeStyles = () => {
        this.styles = ``;
      }
    
      public render = mockRender;
    }

    element = new TestElement();
    mockRegister(element);
    (element as TestElement).changeStyles();
    expect(mockRender).toHaveBeenCalled();
  });

  it('does not cause rerender on when styles did not change', (): void => {
    const mockRender = jest.fn();
    class TestElement extends Component<any, any> {
      public static componentName = 'test-element';

      public styles = `html {color: blue;}`;

      public changeStyles = () => {
        this.styles = `html {color: blue;}`;
      }
    
      public render = mockRender;
    }

    element = new TestElement();
    mockRegister(element);
    (element as TestElement).changeStyles();
    expect(mockRender).not.toHaveBeenCalled();
  });
});
/* eslint-enable max-classes-per-file */

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
});
/* eslint-enable max-classes-per-file */

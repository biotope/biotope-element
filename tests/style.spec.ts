import Component from '../src';
import { createStyle } from '../src/style';

const mockStyle = 'color: red;';

describe('#style', (): void => {
  it('returns a style element', (): void => {
    const element = createStyle('');

    expect(element.tagName).toBe('style');
  });

  it('contains the given style', (): void => {
    const element = createStyle(mockStyle);

    expect(element.innerHTML).toBe(mockStyle);
  });

  it('can receive an object', (): void => {
    const element = createStyle({ toString: (): string => mockStyle });

    expect(element.innerHTML).toBe(mockStyle);
  });

  it('can be used inside the component', (): void => {
    let element: HTMLStyleElement;

    class HelloWorld extends Component {
      public static componentName = 'x-world';

      public render(): void {
        element = this.createStyle(mockStyle);
      }
    }

    const component = new HelloWorld();
    component.render();

    expect(element.tagName).toBe('style');
    expect(element.innerHTML).toBe(mockStyle);
  });
});

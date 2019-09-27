/* eslint-disable max-classes-per-file */
import Component from '../src/index';

describe('#rendered', (): void => {
  let element;
  let functionCalls;

  beforeEach((): void => {
    functionCalls = [];

    class TestElement extends Component {
      public static componentName = 'test-element';

      public render(): HTMLElement {
        functionCalls.push('render');
        return this.html``;
      }

      // eslint-disable-next-line class-methods-use-this
      public rendered(): void {
        functionCalls.push('rendered');
      }
    }
    element = new TestElement();
    element.connectedCallback();
  });

  it('calls the render method', (done): NodeJS.Timeout => setTimeout((): void => {
    expect(functionCalls[0]).toBeTruthy();
    expect(functionCalls[0]).toBe('render');
    done();
  }, 50));

  it('triggers the rendered method', (done): NodeJS.Timeout => setTimeout((): void => {
    expect(functionCalls).toHaveLength(2);
    expect(functionCalls[0]).toBe('render');
    expect(functionCalls[1]).toBe('rendered');
    done();
  }, 50));

  describe('no render method is given', (): void => {
    let mockRendered;

    beforeEach((): void => {
      mockRendered = jest.fn();

      class TestElement extends Component {
        public static componentName = 'test-element';

        public rendered = mockRendered;
      }
      element = new TestElement();
      element.connectedCallback();
      element.render();
    });

    it('triggers the rendered method', (done): NodeJS.Timeout => setTimeout((): void => {
      expect(mockRendered.mock.calls).toHaveLength(2);
      done();
    }, 50));
  });
});
/* eslint-enable max-classes-per-file */

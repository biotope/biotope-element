/* eslint-disable max-classes-per-file */
import Component from '../src/index';

describe('#rendered', (): void => {
  let element;
  let mockRendered;

  beforeEach((): void => {
    mockRendered = jest.fn();
  });

  describe('a render method is given', (): void => {
    beforeEach((): void => {
      class TestElement extends Component {
        public static componentName = 'test-element';

        public render(): HTMLElement {
          return this.html``;
        }

        public rendered = mockRendered;
      }
      element = new TestElement();
      element.render();
    });

    it('triggers the rendered method', (done): NodeJS.Timeout => setTimeout((): void => {
      expect(mockRendered.mock.calls).toHaveLength(1);
      done();
    }, 0));
  });

  describe('no render method is given', (): void => {
    beforeEach((): void => {
      class TestElement extends Component {
        public static componentName = 'test-element';

        public rendered = mockRendered;
      }
      element = new TestElement();
      element.render();
    });

    it('triggers the rendered method', (done): NodeJS.Timeout => setTimeout((): void => {
      expect(mockRendered.mock.calls).toHaveLength(1);
      done();
    }, 0));
  });
});
/* eslint-enable max-classes-per-file */

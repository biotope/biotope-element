/* eslint-disable max-classes-per-file */
import Component from '../src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockRegister = (element: any): void => {
  // eslint-disable-next-line no-underscore-dangle,no-param-reassign
  element.__created = true;
};

describe('#rendered', () => {
  let element;
  let mockRendered;

  beforeEach(() => {
    mockRendered = jest.fn();
  });

  describe('a render method is given', () => {
    beforeEach(() => {
      class TestElement extends Component {
        public static componentName = 'test-element';

        public render(): HTMLElement {
          return this.html``;
        }

        public rendered = mockRendered;
      }
      element = new TestElement();
      mockRegister(element);
      element.render();
    });

    it('triggers the rendered method', (done) => setTimeout(() => {
      expect(mockRendered.mock.calls).toHaveLength(1);
      done();
    }));
  });

  describe('no render method is given', () => {
    beforeEach(() => {
      class TestElement extends Component {
        public static componentName = 'test-element';

        public rendered = mockRendered;
      }
      element = new TestElement();
      mockRegister(element);
      element.render();
    });

    it('triggers the rendered method', (done) => setTimeout(() => {
      expect(mockRendered.mock.calls).toHaveLength(1);
      done();
    }));
  });
});
/* eslint-enable max-classes-per-file */

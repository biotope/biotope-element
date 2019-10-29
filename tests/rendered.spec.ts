/* eslint-disable max-classes-per-file */
import Component from '../src';

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
      element.render();
    });

    it('triggers the rendered method', (done) => setTimeout(() => {
      expect(mockRendered.mock.calls).toHaveLength(1);
      done();
    }));
  });
});
/* eslint-enable max-classes-per-file */

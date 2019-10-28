/* eslint-disable max-classes-per-file */
import Component from '../src';
import { ComponentInstance } from '../src/internal-types';

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

    it('has a rrender method awaiting resolution', (done) => setTimeout(() => {
      // eslint-disable-next-line no-underscore-dangle
      (element as ComponentInstance).__initCallStack[0]();
      setTimeout(() => {
        expect(mockRendered.mock.calls).toHaveLength(2);
        done();
      });
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

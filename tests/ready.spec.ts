/* eslint-disable max-classes-per-file */
import Component, { HTMLFragment } from '../src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockRegister = (element: any): void => {
  // eslint-disable-next-line no-underscore-dangle,no-param-reassign
  element.__created = true;
};

describe('#ready', () => {
  let element;
  let mockReady;

  beforeEach(() => {
    mockReady = jest.fn();
  });

  describe('a render method is given', () => {
    beforeEach(() => {
      class TestElement extends Component {
        public static componentName = 'test-element';

        public render(): HTMLFragment {
          return this.html``;
        }

        public ready = mockReady;
      }
      element = new TestElement();
      mockRegister(element);
      element.render();
      element.render();
    });

    it('triggers the ready method once', (done) => setTimeout(() => {
      expect(mockReady.mock.calls).toHaveLength(1);
      done();
    }));
  });

  describe('no render method is given', () => {
    beforeEach(() => {
      class TestElement extends Component {
        public static componentName = 'test-element';

        public ready = mockReady;
      }
      element = new TestElement();
      mockRegister(element);
      element.render();
      element.render();
    });

    it('triggers the ready method once', (done) => setTimeout(() => {
      expect(mockReady.mock.calls).toHaveLength(1);
      done();
    }));
  });

  describe('event', () => {
    let eventListener;
    let lateEventListener
    beforeEach(() => {
      eventListener = jest.fn();
      lateEventListener = jest.fn();
      class TestElement extends Component {
        public static componentName = 'test-element';

        public ready = mockReady;
      }
      element = new TestElement();
      mockRegister(element);
      element.addEventListener('ready', eventListener)
      element.render();
      element.render();
      setTimeout(() => {
        element.addEventListener('ready', lateEventListener)
      })
    });

    it('emits a ready event', (done) => setTimeout(() => {
      expect(eventListener.mock.calls).toHaveLength(1);
      done();
    }));

    it('directly calls ready eventlistener if already ready', (done) => setTimeout(() => {
      expect(lateEventListener.mock.calls).toHaveLength(1);
      done();
    }));
  });
});
/* eslint-enable max-classes-per-file */

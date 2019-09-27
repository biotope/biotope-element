/* eslint-disable max-classes-per-file */
import Component from '../src';

describe('#shadowRoot', (): void => {
  it('adds shadowRoot by default', (): void => {
    class TestElement extends Component {
      public static componentName = 'test-element';
    }
    const element = new TestElement();

    expect(element.shadowRoot).toBeTruthy();
  });

  describe('can disable shadow root', (): void => {
    let element;

    beforeEach((): void => {
      class TestElement extends Component {
        public static componentName = 'test-element-2';

        public constructor() {
          super(false);
        }
      }
      element = new TestElement();
    });

    it('has shadowRoot disabled', (): void => {
      expect(element.shadowRoot).toBeUndefined();
    });

    it('has shadowRoot disabled', (): void => {
      expect((): void => element.render()).not.toThrowError();
    });
  });
});
/* eslint-enable max-classes-per-file */

/* eslint-disable max-classes-per-file */
import Component from '../src/index';

describe('#props', () => {
  let element: Component;

  beforeEach(() => {
    interface TestElementProps {
      mockAttributeOne: string;
      mockAttributeTwo: string;
    }
    class TestElement extends Component<TestElementProps> {
      public static componentName = 'test-element';

      public static attributes = [
        'mock-attribute-one',
        {
          name: 'mock-attribute-two',
          converter(prop?: string): string {
            return `modded-${prop}`;
          },
        },
      ];

      protected defaultProps: TestElementProps = {
        mockAttributeOne: '',
        mockAttributeTwo: '',
      }
    }
    element = new TestElement();
  });

  it('initially contains the default props', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((element as any).props).toEqual({
      mockAttributeOne: '',
      mockAttributeTwo: '',
    });
  });

  describe('attributeChangedCallback is called with the wrong attribute', () => {
    beforeEach(() => {
      element.render = jest.fn();
      element.attributeChangedCallback('fake-attribute', '', 'fake-new-value');
    });

    it('no new props are set', () => {
      expect((element.render as jest.Mock).mock.calls).toHaveLength(0);
    });
  });

  describe('attributeChangedCallback is called for all props', () => {
    beforeEach(() => {
      element.render = jest.fn();
      element.attributeChangedCallback('mock-attribute-one', '', 'mock-new-value-one');
      element.attributeChangedCallback('mock-attribute-two', '', 'mock-new-value-two');
    });

    it('contains the new props', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((element as any).props).toEqual({
        mockAttributeOne: 'mock-new-value-one',
        mockAttributeTwo: 'modded-mock-new-value-two',
      });
    });

    it('calls render 2 times', () => {
      expect((element.render as jest.Mock).mock.calls).toHaveLength(2);
    });
  });

  describe('no default props given', () => {
    beforeEach(() => {
      class TestElement extends Component {
        public static componentName = 'test-element';

        public static attributes = [
          'mock-attribute-one',
          {
            name: 'mock-attribute-two',
            converter(prop?: string): string {
              return `modded-${prop}`;
            },
          },
        ];
      }
      element = new TestElement();
    });

    it('props is an empty object', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((element as any).props).toEqual({});
    });
  });
});
/* eslint-enable max-classes-per-file */

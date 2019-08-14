import Component from '../src/index';

describe('#props', (): void => {
  let element: Component;

  beforeEach((): void => {
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

      // eslint-disable-next-line class-methods-use-this
      public get defaultProps(): TestElementProps {
        return {
          mockAttributeOne: '',
          mockAttributeTwo: '',
        };
      }
    }
    element = new TestElement();
  });

  it('initially contains the default props', (): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((element as any).props).toEqual({
      mockAttributeOne: '',
      mockAttributeTwo: '',
    });
  });

  describe('attributeChangedCallback is called with the wrong attribute', (): void => {
    beforeEach((): void => {
      element.render = jest.fn();
      element.attributeChangedCallback('fake-attribute', '', 'fake-new-value');
    });

    it('no new props are set', (): void => {
      expect((element.render as jest.Mock).mock.calls).toHaveLength(0);
    });
  });

  describe('attributeChangedCallback is called for all props', (): void => {
    beforeEach((): void => {
      element.render = jest.fn();
      element.attributeChangedCallback('mock-attribute-one', '', 'mock-new-value-one');
      element.attributeChangedCallback('mock-attribute-two', '', 'mock-new-value-two');
    });

    it('contains the new props', (): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((element as any).props).toEqual({
        mockAttributeOne: 'mock-new-value-one',
        mockAttributeTwo: 'modded-mock-new-value-two',
      });
    });

    it('calls render 2 times', (): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((element.render as jest.Mock).mock.calls).toHaveLength(2);
    });
  });

  describe('no default props given', (): void => {
    beforeEach((): void => {
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

    it('returns null as the defaultProps', (): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((element as any).defaultProps).toBeNull();
    });
  });
});

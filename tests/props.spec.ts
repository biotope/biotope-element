import Component from '../src/index';

describe('props', (): void => {
  describe('setter', (): void => {
    it('calls onPropsChanged callback when props setter is called', (): void => {
      const onPropsChangedSpy = jest.fn();

      class Test extends Component {
        public static componentName = 'x-test';

        // eslint-disable-next-line class-methods-use-this
        protected onPropsChanged(): void {
          onPropsChangedSpy();
        }
      }

      const testComponent = Object.create(Test.prototype, {});

      testComponent.props = {
        test: 'someValue',
      };

      expect(onPropsChangedSpy.mock.calls.length).toBe(1);
    });
  });

  describe('getter', (): void => {
    it('returns empty object for no set props', (): void => {
      class Test extends Component {
        public static componentName = 'x-test';
      }

      const testComponent = Object.create(Test.prototype, {});

      expect(Object.keys(testComponent.props)).toHaveLength(0);
    });

    it('returns default props if set', (): void => {
      interface ComponentProps {
        myProp: string;
      }

      class Test extends Component<ComponentProps> {
        public static componentName = 'x-test';

        // eslint-disable-next-line class-methods-use-this
        protected get defaultProps(): ComponentProps {
          return {
            myProp: 'value',
          };
        }
      }
      const testComponent = Object.create(Test.prototype, {});

      expect(testComponent.props.myProp).toBe('value');
    });
  });
});

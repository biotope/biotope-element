import Component from '../src/index';

describe('props', () => {
  describe('setter', () => {
    it('calls onPropsChanged callback when props setter is called', () => {
      const onPropsChangedSpy = jest.fn();

      class Test extends Component<object, object> {
        public static componentName = 'x-test';

        protected onPropsChanged() {
          onPropsChangedSpy();
        };
      }

      const testComponent = Object.create(Test.prototype, {});

      testComponent.props = {
        test: 'someValue',
      };

      expect(onPropsChangedSpy.mock.calls.length).toBe(1);
    })
  })

  describe('getter', () => {
    it('returns empty object for no set props', () => {
      class Test extends Component<object, object> {
        public static componentName = 'x-test';
      }

      const testComponent = Object.create(Test.prototype, {});

      expect(Object.keys(testComponent.props)).toHaveLength(0)
    })

    it('returns default props if set', () => {
      interface ComponentProps {
        myProp: string;
      }

      class Test extends Component<ComponentProps, object> {
        public static componentName = 'x-test';

        protected get defaultProps() {
          return {
            myProp: 'value',
          };
        }
      }
      const testComponent = Object.create(Test.prototype, {});

      expect(testComponent.props.myProp).toBe('value');
    })
  })
})

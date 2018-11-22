import Component from '../src';

test('attributeChangedCallback', () => {
  interface ComponentProps {
    myAttribute: string;
  }
  class Test extends Component<ComponentProps, object> {
    static componentName = 'x-test';
  }

  const testComponent = Object.create(Test.prototype, {});

  testComponent.attributeChangedCallback('myAttribute', '', 'newValue');

  expect(testComponent.props.myAttribute).toBeUndefined();

});

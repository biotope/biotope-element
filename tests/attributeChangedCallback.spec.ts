import { expect } from 'chai';
import Component from '../src';

describe('attributeChangedCallback', () => {
  interface ComponentProps {
    myAttribute: string;
  }

  it('does not let an unwatched attribute pass through to props', () => {
    class Test extends Component<ComponentProps, object> {
      static componentName = 'x-test';
    }

    const testComponent = Object.create(Test.prototype, {});

    testComponent.attributeChangedCallback('myAttribute', '', 'newValue');

    expect(testComponent.props.myAttribute).to.be.undefined;
  });

  it('writes watched attributes to props', () => {
    class Test extends Component<ComponentProps, object> {
      static componentName = 'x-test';
      static attributes = ['myAttribute'];
    }

    const testComponent = Object.create(Test.prototype, {});

    testComponent.attributeChangedCallback('myAttribute', '', 'newValue');

    expect(testComponent.props.myAttribute).to.eq('newValue');
  });
})

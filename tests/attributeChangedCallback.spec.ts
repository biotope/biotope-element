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

  it('transforms dash attributes to camelcase', () => {
    class Test extends Component<ComponentProps, object> {
      static componentName = 'x-test';
      static attributes = ['my-attribute'];
    }

    const testComponent = Object.create(Test.prototype, {});

    testComponent.attributeChangedCallback('my-attribute', '', 'newValue');

    expect(testComponent.props).to.have.key('myAttribute');
  });

  it('transforms single letter dash attributes to camelcase', () => {
    class Test extends Component<ComponentProps, object> {
      static componentName = 'x-test';
      static attributes = ['m-attribute'];
    }

    const testComponent = Object.create(Test.prototype, {});

    testComponent.attributeChangedCallback('m-attribute', '', 'newValue');

    expect(testComponent.props).to.have.key('mAttribute');
  });

  it('sets dash attributes to camelcase', () => {
    class Test extends Component<ComponentProps, object> {
      static componentName = 'x-test';
      static attributes = ['my-attribute'];
    }

    const testComponent = Object.create(Test.prototype, {});

    testComponent.attributeChangedCallback('my-attribute', '', 'newValue');

    expect(testComponent.props.myAttribute).to.eq('newValue');
  });
})

import Component from '../src';

describe('attributeChangedCallback', () => {
  interface ComponentProps {
    myAttribute: string;
  }

  it('does not let an unwatched attribute pass through to props', () => {
    class Test extends Component<ComponentProps, object> {
      static componentName = 'x-test';
    }

    const testComponent = new Test();

    testComponent.attributeChangedCallback('myAttribute', '', 'newValue');

    expect(testComponent.props.myAttribute).toBeUndefined();
  });

  it('writes watched attributes to props', () => {
    class Test extends Component<ComponentProps, object> {
      static componentName = 'x-test';
      static attributes = ['myAttribute'];
    }

    const testComponent = new Test();

    testComponent.attributeChangedCallback('myAttribute', '', 'newValue');

    expect(testComponent.props.myAttribute).toBe('newValue');
  });

  it('transforms dash attributes to camelcase', () => {
    class Test extends Component<ComponentProps, object> {
      static componentName = 'x-test';
      static attributes = ['my-attribute'];
    }

    const testComponent = new Test();

    testComponent.attributeChangedCallback('my-attribute', '', 'newValue');

    expect(testComponent.props.myAttribute).toBeDefined;
  });

  it('transforms single letter dash attributes to camelcase', () => {
    class Test extends Component<ComponentProps, object> {
      static componentName = 'x-test';
      static attributes = ['m-attribute'];
    }

    const testComponent = new Test();

    testComponent.attributeChangedCallback('m-attribute', '', 'newValue');

    expect(testComponent.props.myAttribute).toBeDefined;
  });

  it('sets dash attributes to camelcase', () => {
    class Test extends Component<ComponentProps, object> {
      static componentName = 'x-test';
      static attributes = ['my-attribute'];
    }

    const testComponent = new Test();

    testComponent.attributeChangedCallback('my-attribute', '', 'newValue');

    expect(testComponent.props.myAttribute).toBe('newValue');
  });

  it('applies converter to attributes', () => {
    class Test extends Component<ComponentProps, object> {
      static componentName = 'x-test';
      static attributes = [
        {
          name: 'my-attribute',
          converter: (input: any) => 'output'
        }
      ];
    }

    const testComponent = new Test();

    testComponent.attributeChangedCallback('my-attribute', '', 'newValue');

    expect(testComponent.props.myAttribute).toBe('output');
  });
})

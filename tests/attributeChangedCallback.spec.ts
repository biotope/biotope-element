import Component from '../src';

describe('attributeChangedCallback', (): void => {
  interface ComponentProps {
    myAttribute: string;
  }

  it('does not let an unwatched attribute pass through to props', (): void => {
    class Test extends Component<ComponentProps> {
      public static componentName = 'x-test';
    }

    const testComponent = new Test();

    testComponent.attributeChangedCallback('myAttribute', '', 'newValue');

    expect(testComponent.props.myAttribute).toBeUndefined();
  });

  it('writes watched attributes to props', (): void => {
    class Test extends Component<ComponentProps> {
      public static componentName = 'x-test';

      public static attributes = ['myAttribute'];
    }

    const testComponent = new Test();

    testComponent.attributeChangedCallback('myAttribute', '', 'newValue');

    expect(testComponent.props.myAttribute).toBe('newValue');
  });

  it('transforms dash attributes to camelcase', (): void => {
    class Test extends Component<ComponentProps> {
      public static componentName = 'x-test';

      public static attributes = ['my-attribute'];
    }

    const testComponent = new Test();

    testComponent.attributeChangedCallback('my-attribute', '', 'newValue');

    expect(testComponent.props.myAttribute).toBeDefined();
  });

  it('transforms single letter dash attributes to camelcase', (): void => {
    class Test extends Component<ComponentProps> {
      public static componentName = 'x-test';

      public static attributes = ['my-attribute'];
    }

    const testComponent = new Test();

    testComponent.attributeChangedCallback('my-attribute', '', 'newValue');

    expect(testComponent.props.myAttribute).toBeDefined();
  });

  it('sets dash attributes to camelcase', (): void => {
    class Test extends Component<ComponentProps> {
      public static componentName = 'x-test';

      public static attributes = ['my-attribute'];
    }

    const testComponent = new Test();

    testComponent.attributeChangedCallback('my-attribute', '', 'newValue');

    expect(testComponent.props.myAttribute).toBe('newValue');
  });

  it('applies converter to attributes', (): void => {
    class Test extends Component<ComponentProps> {
      public static componentName = 'x-test';

      public static attributes = [
        {
          name: 'my-attribute',
          converter: (): string => 'output',
        },
      ];
    }

    const testComponent = new Test();

    testComponent.attributeChangedCallback('my-attribute', '', 'newValue');

    expect(testComponent.props.myAttribute).toBe('output');
  });
});

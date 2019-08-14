import Component from '../src/index';

describe('#observedAttributes', (): void => {
  let element: Component;

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

  it('contains the 2 attributes', (): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((element as any).constructor.observedAttributes).toHaveLength(2);
  });

  it('contains the attributes\' names', (): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((element as any).constructor.observedAttributes[0]).toBe('mock-attribute-one');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((element as any).constructor.observedAttributes[1]).toBe('mock-attribute-two');
  });
});

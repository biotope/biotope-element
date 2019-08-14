import Component from '../src/index';

describe('#observedAttributes', (): void => {
  let element;
  let originalCustomElementsDefine;

  beforeEach((): void => {
    originalCustomElementsDefine = customElements.define;
    customElements.define = jest.fn();

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
    TestElement.register();
    element = new TestElement();
  });

  afterEach((): void => {
    customElements.define = originalCustomElementsDefine;
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

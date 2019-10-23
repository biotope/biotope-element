import Component from '../src';
import { ComponentInstance } from '../src/internal-types';

describe('#observedAttributes', () => {
  let element: Component;
  let originalCustomElementsDefine;

  beforeEach(() => {
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
        '',
        null,
        {
          name: 'mock-attribute-three',
          type: 'string',
        },
      ];
    }
    TestElement.register();
    element = new TestElement();
  });

  afterEach(() => {
    customElements.define = originalCustomElementsDefine;
  });

  it('contains the 3 attributes', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((element as any as ComponentInstance).constructor.observedAttributes).toHaveLength(3);
  });

  it('contains the attributes\' names', () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    expect((element as any as ComponentInstance).constructor.observedAttributes[0]).toBe('mock-attribute-one');
    expect((element as any as ComponentInstance).constructor.observedAttributes[1]).toBe('mock-attribute-two');
    expect((element as any as ComponentInstance).constructor.observedAttributes[2]).toBe('mock-attribute-three');
    /* eslint-enable @typescript-eslint/no-explicit-any */
  });
});

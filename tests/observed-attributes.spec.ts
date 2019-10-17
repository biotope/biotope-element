import Component from '../src/index';
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
      ];
    }
    TestElement.register();
    element = new TestElement();
  });

  afterEach(() => {
    customElements.define = originalCustomElementsDefine;
  });

  it('contains the 2 attributes', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((element as any as ComponentInstance).constructor.observedAttributes).toHaveLength(2);
  });

  it('contains the attributes\' names', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((element as any as ComponentInstance).constructor.observedAttributes[0]).toBe('mock-attribute-one');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((element as any as ComponentInstance).constructor.observedAttributes[1]).toBe('mock-attribute-two');
  });
});

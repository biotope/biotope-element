import Component from '../src/index';

describe('#created', (): void => {
  let functionCalls;
  let originalCustomElementsDefine;
  let element;

  beforeEach((): void => {
    functionCalls = [];
    originalCustomElementsDefine = customElements.define;
    customElements.define = jest.fn();

    class TestElement extends Component {
      public static componentName = 'test-element';

      // eslint-disable-next-line class-methods-use-this
      public created(): void {
        functionCalls.push('created');
      }

      // eslint-disable-next-line class-methods-use-this
      public connectedCallback(): void {
        functionCalls.push('connectedCallback');
      }

      // eslint-disable-next-line class-methods-use-this
      public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        functionCalls.push('attributeChangedCallback');
      }
    }
    TestElement.register();
    element = new TestElement();
    // console.log(element.attributeChangedCallback.toString());
  });

  afterEach((): void => {
    customElements.define = originalCustomElementsDefine;
  });

  it('is called before connectedCallback', (): void => {
    element.connectedCallback();

    expect(functionCalls).toHaveLength(2);
    expect(functionCalls[0]).toBe('created');
    expect(functionCalls[1]).toBe('connectedCallback');
  });

  it('connectedCallback is called before attributeChangedCallback', (): void => {
    element.attributeChangedCallback('mock-name', 'old-value', 'new-value');
    element.attributeChangedCallback('mock-name-2', 'old-value-2', 'new-value-2');
    element.connectedCallback();

    expect(functionCalls).toHaveLength(4);
    expect(functionCalls[0]).toBe('created');
    expect(functionCalls[1]).toBe('connectedCallback');
    expect(functionCalls[2]).toBe('attributeChangedCallback');
    expect(functionCalls[3]).toBe('attributeChangedCallback');
  });
});
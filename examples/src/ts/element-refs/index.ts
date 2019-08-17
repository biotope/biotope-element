import Component, { createRef, RefObject } from '@biotope/element';

export class ExampleRefs extends Component {
  public static componentName = 'example-refs';

  public static attributes = ['text'];

  private firstInput: RefObject<HTMLInputElement> = createRef();

  public constructor() {
    super();
    this.handleFocus = this.handleFocus.bind(this);
  }

  public render(): HTMLElement {
    return this.html`
      <input type="text" ref=${this.firstInput} />
      <button onclick=${this.handleFocus}>Focus input</button>
    `;
  }

  private handleFocus(): void {
    if (this.firstInput.current) {
      this.firstInput.current.focus();
    }
  }
}

ExampleRefs.register();

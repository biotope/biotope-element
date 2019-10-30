import Component, { createRef, RefObject, HTMLFragment } from '@biotope/element';

export class ExampleRefs extends Component {
  public static componentName = 'example-refs';

  public static attributes = ['text'];

  private inputRef: RefObject<HTMLInputElement> = createRef();

  public constructor() {
    super();
    this.handleFocus = this.handleFocus.bind(this);
  }

  public render(): HTMLFragment {
    return this.html`
      <input type="text" ref=${this.inputRef} />
      <button onclick=${this.handleFocus}>Focus input</button>
    `;
  }

  private handleFocus(): void {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }
}

ExampleRefs.register();

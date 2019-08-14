import Component from '@biotope/element';

export class ExampleRefs extends Component {
  public static componentName = 'example-refs';

  public static attributes = ['text'];

  private get inputRef(): HTMLInputElement {
    return this.shadowRoot.querySelector('input');
  }

  public constructor() {
    super();
    this.handleFocus = this.handleFocus.bind(this);
  }

  public render(): ShadowRoot | HTMLElement {
    return this.html`
      <input type="text" />
      <input type="text" />
      <button onclick=${this.handleFocus}>Focus first input!</button>
    `;
  }

  private handleFocus(): void {
    if (this.inputRef) {
      this.inputRef.focus();
    }
  }
}

ExampleRefs.register();

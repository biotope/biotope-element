import Component, { createRef, HTMLFragment } from '@biotope/element';

export class ExampleRefs extends Component {
  public static componentName = 'example-refs';

  public static attributes = ['text'];

  private refs = {
    input: createRef<HTMLInputElement>(),
  };

  public constructor() {
    super();
    this.handleFocus = this.handleFocus.bind(this);
  }

  public render(): HTMLFragment {
    return this.html`
      <input type="text" ref=${this.refs.input} />
      <button onclick=${this.handleFocus}>Focus input</button>
    `;
  }

  private handleFocus(): void {
    const { input } = this.refs;
    if (input.current) {
      input.current.focus();
    }
  }
}

ExampleRefs.register();

import Component from '@biotope/element';

export const ExampleSenderEvents = {
  change: 'examplesender.change',
};

export type ExampleSenderChangeType = CustomEvent<string>;

export class ExampleSender extends Component {
  public static componentName = 'example-sender';

  public constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  public render(): ShadowRoot | HTMLElement {
    return this.html`
      <label>Label</label>
      <input onkeyup=${this.handleChange} type="text" />
    `;
  }

  private handleChange(): void {
    // eslint-disable-next-line no-console
    console.log('Emitting change on the input…');
    this.emit(ExampleSenderEvents.change, this.shadowRoot.querySelector('input').value);
  }
}

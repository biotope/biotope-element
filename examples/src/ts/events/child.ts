import Component from '@biotope/element';

export const ExampleSenderEvents = {
  change: 'examplesender.change',
};

export type ExampleSenderChangeType = CustomEvent<string>;

export class ExampleSender extends Component {
  public static componentName = 'example-sender';

  public constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  public render(): HTMLElement {
    return this.html`
      <label>Label</label>
      <input onkeyup=${this.onChange} type="text" />
    `;
  }

  public onChange(): void {
    // eslint-disable-next-line no-console
    console.log('Emitting change on the input…');
    this.emit(ExampleSenderEvents.change, this.shadowRoot.querySelector('input').value);
  }
}

import Component from '@biotope/element';
import { ExampleSender, ExampleSenderChangeType } from './child';

export class ExampleReceiver extends Component {
  public static componentName = 'example-receiver';

  public static dependencies = [
    ExampleSender as typeof Component,
  ];

  public constructor() {
    super();
    this.hanldleInputChange = this.hanldleInputChange.bind(this);
  }

  public render(): ShadowRoot | HTMLElement {
    return this.html`
      <div>
        <example-sender onexamplesender.change=${this.hanldleInputChange} />
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  private hanldleInputChange({ target, detail }: ExampleSenderChangeType): void {
    // eslint-disable-next-line no-console
    console.log('Input change event on: ', target);
    // eslint-disable-next-line no-console
    console.log('Current value for input: ', detail);
  }
}

ExampleReceiver.register();

import Component, { HTMLFragment } from '@biotope/element';
import { ExampleSender, ExampleSenderChangeType } from './child';

export class ExampleReceiver extends Component {
  public static componentName = 'example-receiver';

  public static dependencies = [
    ExampleSender as typeof Component,
  ];

  public constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  public render(): HTMLFragment {
    return this.html`
      <div>
        <example-sender
          onclick=${this.handleClick}
          onexamplesender.change=${this.handleInputChange}
        />
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  private handleClick(): void {
    // eslint-disable-next-line no-console
    console.log('simple click example');
  }

  // eslint-disable-next-line class-methods-use-this
  private handleInputChange({ target, detail }: ExampleSenderChangeType): void {
    // eslint-disable-next-line no-console
    console.log('Input change event on: ', target);
    // eslint-disable-next-line no-console
    console.log('Current value for input: ', detail);
  }
}

ExampleReceiver.register();

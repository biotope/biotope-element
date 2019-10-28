import Component from '@biotope/element';
import { ExampleSender } from './child';

export class ExampleReceiver extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  render() {
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
  handleClick() {
    // eslint-disable-next-line no-console
    console.log('simple click example');
  }

  // eslint-disable-next-line class-methods-use-this
  handleInputChange({ target, detail }) {
    // eslint-disable-next-line no-console
    console.log('Input change event on: ', target);
    // eslint-disable-next-line no-console
    console.log('Current value for input: ', detail);
  }
}

ExampleReceiver.componentName = 'example-receiver';
ExampleReceiver.dependencies = [
  ExampleSender,
];
ExampleReceiver.register();

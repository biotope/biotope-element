import Component from '@biotope/element';
import { ExampleSender } from './child';

export class ExampleReceiver extends Component {
  constructor() {
    super();
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  render() {
    return this.html`
      <div>
        <example-sender onexamplesender.change=${this.handleInputChange} />
      </div>
    `;
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

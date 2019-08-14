import Component from '@biotope/element';
import { ExampleSender } from './child';

export class ExampleReceiver extends Component {
  constructor() {
    super();
    this.onInputChange = this.onInputChange.bind(this);
  }

  render() {
    return this.html`
      <div>
        <example-sender onexamplesender.change=${this.onInputChange} />
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  onInputChange({ target, detail }) {
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

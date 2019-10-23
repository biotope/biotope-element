import Component, { createRef } from '@biotope/element';

export const ExampleSenderEvents = {
  change: 'examplesender.change',
};

export class ExampleSender extends Component {
  constructor() {
    super();
    this.input = createRef();
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return this.html`
      <label>Label</label>
      <input ref=${this.input} onkeyup=${this.handleChange} type="text" />
    `;
  }

  handleChange() {
    // eslint-disable-next-line no-console
    console.log('Emitting change on the input…');
    this.emit(ExampleSenderEvents.change, this.input.current.value);
  }
}

ExampleSender.componentName = 'example-sender';

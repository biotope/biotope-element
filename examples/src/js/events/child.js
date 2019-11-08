import Component, { createRef } from '@biotope/element';

export const ExampleSenderEvents = {
  change: 'examplesender.change',
};

export class ExampleSender extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.refs = {
      input: createRef(),
    };
  }

  render() {
    return this.html`
      <label>Label</label>
      <input ref=${this.refs.input} onkeyup=${this.handleChange} type="text" />
    `;
  }

  handleChange() {
    // eslint-disable-next-line no-console
    console.log('Emitting change on the input…');
    this.emit(ExampleSenderEvents.change, this.refs.input.current.value);
  }
}

ExampleSender.componentName = 'example-sender';

import Component, { createRef } from '@biotope/element';

export class ExampleRefs extends Component {
  constructor() {
    super();
    this.handleFocus = this.handleFocus.bind(this);
    this.refs = {
      input: createRef(),
    };
  }

  render() {
    return this.html`
      <input type="text" ref=${this.refs.input} />
      <button onclick=${this.handleFocus}>Focus input</button>
    `;
  }

  handleFocus() {
    const { input } = this.refs;
    if (input.current) {
      input.current.focus();
    }
  }
}

ExampleRefs.componentName = 'example-refs';
ExampleRefs.attributes = ['text'];
ExampleRefs.register();

import Component, { createRef } from '@biotope/element';

export class ExampleRefs extends Component {
  inputRef = createRef();

  constructor() {
    super();
    this.handleFocus = this.handleFocus.bind(this);
  }

  render() {
    return this.html`
      <input type="text" ref=${this.inputRef} />
      <button onclick=${this.handleFocus}>Focus input</button>
    `;
  }

  handleFocus() {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }
}

ExampleRefs.componentName = 'example-refs';
ExampleRefs.attributes = ['text'];
ExampleRefs.register();

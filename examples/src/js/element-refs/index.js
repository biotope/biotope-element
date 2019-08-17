import Component, { createRef } from '@biotope/element';

export class ExampleRefs extends Component {
  firstInput = createRef();

  constructor() {
    super();
    this.handleFocus = this.handleFocus.bind(this);
  }

  render() {
    return this.html`
      <input type="text" ref=${this.firstInput} />
      <button onclick=${this.handleFocus}>Focus input</button>
    `;
  }

  handleFocus() {
    if (this.firstInput.current) {
      this.firstInput.current.focus();
    }
  }
}

ExampleRefs.componentName = 'example-refs';
ExampleRefs.attributes = ['text'];
ExampleRefs.register();

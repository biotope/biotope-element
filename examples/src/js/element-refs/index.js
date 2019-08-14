import Component from '@biotope/element';

export class ExampleRefs extends Component {
  get inputRef() {
    return this.shadowRoot.querySelector('input');
  }

  constructor() {
    super();
    this.focusFirstInput = this.focusFirstInput.bind(this);
  }

  render() {
    return this.html`
      <input type="text" />
      <input type="text" />
      <button onclick=${this.focusFirstInput}>Focus first input!</button>
    `;
  }

  focusFirstInput() {
    if (this.inputRef) {
      this.inputRef.focus();
    }
  }
}

ExampleRefs.componentName = 'example-refs';
ExampleRefs.attributes = ['text'];
ExampleRefs.register();

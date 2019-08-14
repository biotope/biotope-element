import Component from '@biotope/element';

export class ExampleRefs extends Component {
  get inputRef() {
    return this.shadowRoot.querySelector('input');
  }

  constructor() {
    super();
    this.handleFocus = this.handleFocus.bind(this);
  }

  render() {
    return this.html`
      <input type="text" />
      <input type="text" />
      <button onclick=${this.handleFocus}>Focus first input!</button>
    `;
  }

  handleFocus() {
    if (this.inputRef) {
      this.inputRef.focus();
    }
  }
}

ExampleRefs.componentName = 'example-refs';
ExampleRefs.attributes = ['text'];
ExampleRefs.register();

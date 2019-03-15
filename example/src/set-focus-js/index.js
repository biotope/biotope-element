import Component from '../../../src/index';

class XC extends Component {
  constructor() {
    super();
    this.changeProps = this.changeProps.bind(this);
  }

  onPropsChanged() {
    this.setFocus();
  }

  connectedCallback() {
    this.setFocus();
  }

  changeProps() {
    this.setAttribute('text', Date.now().toString());
  }

  setFocus() {
    const inputElement = this.shadowRoot.querySelector('input');
    inputElement.focus();
  }

  render() {
    this.html`
      <input type="text" />
      <button onclick=${this.changeProps}>Change props</button>
    `;
  }
}

XC.attributes = [
  'text'
];

XC.componentName = 'x-component';

XC.register();

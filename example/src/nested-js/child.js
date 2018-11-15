import Component from '../../../src/index';

export class TextInput extends Component {
  render() {
    this.html`
      <label>Label</label>
      <input type="text">
    `;
  }
}

TextInput.componentName = 'x-text-input';

TextInput.register();

import Component from '../../../src/index';

export const TEXT_INPUT_EVENTS = {
  CHANGE: 'textinput.change'
}

export class TextInput extends Component {
  render() {
    this.html`
      <label>Label</label>
      <input onchange=${this} type="text">
    `;
  }

  onchange() {
    console.log('Change on the input');
    this.dispatchEvent(new CustomEvent(TEXT_INPUT_EVENTS.CHANGE));
  }
}

TextInput.componentName = 'x-text-input';

TextInput.register();

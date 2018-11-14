import Component from '../../../src/index';

enum InputType {
  Text = "text",
  Password = "password",
}

interface TextInputProps {
  label: String
  type: InputType
}

interface TextInputState {
  value: String
}

export class TextInput extends Component<TextInputProps, TextInputState> {
  static componentName = 'x-text-input';
  render() {
    this.html`
      <label>Label</label>
      <input type="text">
    `;
  }
}

TextInput.register();

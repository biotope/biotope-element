import Component from '../../../src/index';
import { TextInput } from './child';

class Form extends Component<any, any> {
  static componentName = 'x-form';
  static dependencies = [
    TextInput as typeof Component,
  ];

  render() {
    this.html`
      <form>
        <x-text-input />
      </form>
    `;
  }
}

Form.register();

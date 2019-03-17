import Component from '@biotope/element';
import { TextInput } from './child';

class Form extends Component {
  render() {
    this.html`
      <form>
        <x-text-input />
      </form>
    `;
  }
}

Form.componentName = 'x-form';
Form.dependencies = [
  TextInput,
];

Form.register();

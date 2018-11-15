import Component from '../../../src/index';
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

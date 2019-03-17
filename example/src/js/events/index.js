import Component from '@biotope/element';
import { TextInput } from './child';

class XForm extends Component {
  render() {
    this.html`
      <form>
        <x-text-input ontextinput.change="${this.onInputChange.bind(this)}" />
      </form>
    `;
  }

  onInputChange(event) {
    console.log('Input change event on: ', event.target);
    this.dispatchEvent(new CustomEvent('change'));
  }
}

XForm.componentName = 'x-form';
XForm.dependencies = [
  TextInput,
];

XForm.register();

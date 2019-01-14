import Component from '../../../src/index';
import ChildSlot from './ChildSlot';

class Slots extends Component<any, any> {
  static componentName = 'x-slots';
  static dependencies = [ChildSlot]
  render() {
    this.html`
    <x-child-slot>
      <slot />
    </x-child-slot>
    `;
  }
}

Slots.register();

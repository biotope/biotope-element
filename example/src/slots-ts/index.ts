import Component from '../../../src/index';

class Slots extends Component<any, any> {
  static componentName = 'x-slots';
  render() {
    this.html`
      <slot />
      <p>I'm text.</p>
    `;
  }
}

Slots.register();

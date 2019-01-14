import Component from '../../../src/index';

class FullName extends Component<any, any> {
  static componentName = 'x-full-name';
  render() {
    this.html`
      <style>
        ::slotted(*) {
          color: orange;
        }
      </style>
      Firstname:
      <slot name="first">FIRSTNAME</slot>
      Lastname:
      <slot name="last">LASTNAME</slot>
    `;
  }
}

FullName.register();

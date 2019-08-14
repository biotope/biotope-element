import Component from '@biotope/element';

export class ExampleSlots extends Component {
  render() {
    return this.html`
      <style>
        ::slotted(*) {
          color: orange;
        }
      </style>
      <div>
        Firstname: <slot name="first">FIRSTNAME</slot>
        Lastname: <slot name="last">LASTNAME</slot>
        Default: <slot />
      </div>
    `;
  }
}

ExampleSlots.componentName = 'example-slots';
ExampleSlots.register();

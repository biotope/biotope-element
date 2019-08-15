import Component from '@biotope/element';

export class ExampleSlots extends Component {
  public static componentName = 'example-slots';

  public render(): ShadowRoot | HTMLElement {
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

ExampleSlots.register();

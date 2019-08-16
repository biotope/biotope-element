import Component from '@biotope/element';

export class ExampleSlots extends Component {
  public static componentName = 'example-slots';

  public render(): HTMLElement {
    return this.html`
      <style>
        .slotted {
          color: orange;
        }

        /* does not work on IE/Edge */
        ::slotted(*) {
          color: orange;
        }
      </style>
      <div>
        Firstname: <span class="slotted"><slot name="first">FIRSTNAME</slot></span>
        Lastname: <span class="slotted"><slot name="last">LASTNAME</slot></span>
        Default: <span class="slotted"><slot /></span>
      </div>
    `;
  }
}

ExampleSlots.register();

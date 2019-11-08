import Component, { HTMLFragment } from '@biotope/element';

export class ExampleChild extends Component {
  public static componentName = 'example-child';

  public render(): HTMLFragment {
    return this.html`
      <div class="slotted">
        <slot />
      </div>
      <p>I am not slotted.</p>
      <style>
        .slotted {
          color: blue;
        }

        /* does not work on IE/Edge */
        ::slotted(*) {
          color: blue;
        }
      </style>
    `;
  }
}

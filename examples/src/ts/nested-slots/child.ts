import Component from '@biotope/element';

export class ExampleChild extends Component {
  public static componentName = 'example-child';

  public render(): HTMLElement {
    return this.html`
      <style>
        :host {
          color: orange;
        }

        ::slotted(*) {
          color: blue;
        }
      </style>
      <slot />
      <p>I am not slotted.</p>
    `;
  }
}

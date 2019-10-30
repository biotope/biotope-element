import Component, { HTMLFragment } from '@biotope/element';

export class ExampleSlots extends Component {
  public static componentName = 'example-slots';

  public render(): HTMLFragment {
    return this.html`
      <p>I'm the TOP text of the component.</p>
      <slot />
      <p>I'm the BOTTOM text of the component.</p>
    `;
  }
}

ExampleSlots.register();

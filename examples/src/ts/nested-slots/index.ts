import Component, { HTMLFragment } from '@biotope/element';
import { ExampleChild } from './child';

export class ExampleParent extends Component {
  public static componentName = 'example-parent';

  public static dependencies = [
    ExampleChild as typeof Component,
  ];

  public render(): HTMLFragment {
    return this.html`
      <example-child>
        <slot />
      </example-child>
    `;
  }
}

ExampleParent.register();

import Component from '@biotope/element';
import { ExampleChild } from './child';

export class ExampleParent extends Component {
  public static componentName = 'example-parent';

  public static dependencies = [
    ExampleChild as typeof Component,
  ];

  public render(): ShadowRoot | HTMLElement {
    return this.html`
      <example-child>
        <slot />
      </example-child>
    `;
  }
}

ExampleParent.register();

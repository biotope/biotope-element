import Component from '@biotope/element';
import { ExampleChild } from './child';

export class ExampleParent extends Component {
  render() {
    return this.html`
      <example-child>
        <slot />
      </example-child>
    `;
  }
}

ExampleParent.componentName = 'example-parent';
ExampleParent.dependencies = [
  ExampleChild,
];
ExampleParent.register();

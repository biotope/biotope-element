import Component from '@biotope/element';
import { ExampleChild } from './child';

export class ExampleParent extends Component {
  render() {
    return this.html`
      <div>
        <example-child
          text=${this.props.text}
          another-text="Hello World"
        />
      </div>
    `;
  }
}

ExampleParent.componentName = 'example-parent';
ExampleParent.attributes = ['text'];
ExampleParent.dependencies = [
  ExampleChild,
];
ExampleParent.register();

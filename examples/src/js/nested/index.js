import Component from '@biotope/element';
import { ExampleChild } from './child';

export class ExampleParent extends Component {
  constructor() {
    super(false);
  }

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

  // eslint-disable-next-line class-methods-use-this
  rendered() {
    // eslint-disable-next-line no-console
    console.log('PARENT: elements are in the DOM');
  }
}

ExampleParent.componentName = 'example-parent';
ExampleParent.attributes = ['text'];
ExampleParent.dependencies = [
  ExampleChild,
];
ExampleParent.register();

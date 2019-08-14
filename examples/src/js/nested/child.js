import Component from '@biotope/element';

export class ExampleChild extends Component {
  render() {
    return this.html`
      <p>parent prop: ${this.props.text}</p>
      <p>my prop: ${this.props.anotherText}</p>
    `;
  }
}

ExampleChild.componentName = 'example-child';
ExampleChild.attributes = [
  'text',
  'another-text',
];

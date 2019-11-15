import Component from '@biotope/element';

export class ExampleChild extends Component {
  constructor() {
    super(false);
  }

  render() {
    return this.html`
      <p>parent prop: ${this.props.text}</p>
      <p>my prop: ${this.props.anotherText}</p>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  rendered() {
    // eslint-disable-next-line no-console
    console.log('CHILD: elements are in the DOM');
  }
}

ExampleChild.componentName = 'example-child';
ExampleChild.attributes = [
  'text',
  'another-text',
];

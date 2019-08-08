import Component from '@biotope/element';

interface ExampleChildProps {
  text?: string;
  anotherText?: string;
}

export class ExampleChild extends Component<ExampleChildProps> {
  public static componentName = 'example-child';

  public static attributes = [
    'text',
    'another-text',
  ];

  public render(): HTMLElement {
    return this.html`
      <p>parent prop: ${this.props.text}</p>
      <p>my prop: ${this.props.anotherText}</p>
    `;
  }
}

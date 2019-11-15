import Component, { HTMLFragment } from '@biotope/element';

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

  public constructor() {
    super(false);
  }

  public render(): HTMLFragment {
    return this.html`
      <p>parent prop: ${this.props.text}</p>
      <p>my prop: ${this.props.anotherText}</p>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  public rendered(): void {
    // eslint-disable-next-line no-console
    console.log('CHILD: elements are in the DOM');
  }
}

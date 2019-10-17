import Component from '@biotope/element';

interface ExampleChildProps {
  myCallback: (randomNumber?: number) => string;
  myArray: number[];
  mySecondArray: number[];
}

export class ExampleChild extends Component<ExampleChildProps> {
  public static componentName = 'example-child';

  public static attributes = [
    { name: 'my-callback', type: 'function' },
    { name: 'my-array', type: 'array' },
    { name: 'my-second-array', type: 'array' },
  ];

  protected readonly defaultProps = {
    myCallback: (randomNumber?: number): string => randomNumber.toString(),
    myArray: [],
    mySecondArray: [],
  };

  public render(): HTMLElement {
    // eslint-disable-next-line no-console
    console.log('child rendered');
    const randomNumber = Math.round(Math.random() * 200 - 100) / 10;

    return this.html`
      <p>Result: ${this.props.myCallback(randomNumber)}</p>
      <div>
        ${this.props.myArray.map((value) => this.html`
          <span>${value + 1},</span>
        `)}
      </div>
      <div>
        ${this.props.mySecondArray.map((value) => this.html`
          <span>${value * 12},</span>
        `)}
      </div>
    `;
  }
}

ExampleChild.register();

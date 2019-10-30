import Component, { HTMLFragment } from '@biotope/element';

interface ExampleChildProps {
  myCallback: (randomNumber?: number) => string;
  myArray: number[];
  mySecondArray: number[];
  myInterpolated: string;
}

export class ExampleChild extends Component<ExampleChildProps> {
  public static componentName = 'example-child';

  public static attributes = [
    { name: 'my-interpolated' },
    { name: 'my-callback', type: 'function' },
    { name: 'my-array', type: 'array' },
    { name: 'my-second-array', type: 'array' },
  ];

  protected readonly defaultProps = {
    myCallback: (randomNumber?: number): string => randomNumber.toString(),
    myArray: [],
    mySecondArray: [],
    myInterpolated: '',
  };

  public render(): HTMLFragment {
    // eslint-disable-next-line no-console
    console.log('child rendered');
    const randomNumber = Math.round(Math.random() * 200 - 100) / 10;

    return this.html`
      <h2>${this.props.myInterpolated}</h2>
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

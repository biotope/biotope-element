import Component from '@biotope/element';

export class ExampleChild extends Component {
  constructor() {
    super();
    this.defaultProps = {
      myCallback: (randomNumber) => randomNumber.toString(),
      myArray: [],
      mySecondArray: [],
      myInterpolated: '',
    };
  }

  render() {
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

ExampleChild.componentName = 'example-child';
ExampleChild.attributes = [
  { name: 'my-interpolated' },
  { name: 'my-callback', type: 'function' },
  { name: 'my-array', type: 'array' },
  { name: 'my-second-array', type: 'array' },
];
ExampleChild.register();

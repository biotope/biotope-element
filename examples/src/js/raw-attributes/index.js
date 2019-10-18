import Component from '@biotope/element';
import { ExampleChild } from './child';

export class ExampleText extends Component {
  constructor() {
    super();
    this.myArray = [1, 2, 3, 4, 5];
    this.randomNumber = Math.round(Math.random() * 10);
  }

  render() {
    // eslint-disable-next-line no-console
    console.log('parent rendered');

    return this.html`
      <h1>H1 Headline</h1>
      <example-child
        my-callback=${this.childCallback}
        my-array=${this.myArray}
        my-second-array=${JSON.stringify(this.myArray)}
        my-interpolated="I like the number ${this.randomNumber} very much!"
      ></example-child>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  childCallback(number) {
    const stringified = number >= 0 ? 'positive' : 'negative';
    return `Parent says that "${number}" is ${number !== 0 ? stringified : 'zero'}`;
  }
}


ExampleText.componentName = 'example-text';
ExampleText.dependencies = [
  ExampleChild,
];
ExampleText.register();

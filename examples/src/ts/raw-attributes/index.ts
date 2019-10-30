import Component from '@biotope/element';
import { ExampleChild } from './child';

const childCallback = (number?: number): string => {
  const stringified = number >= 0 ? 'positive' : 'negative';
  return `Parent says that "${number}" is ${number !== 0 ? stringified : 'zero'}`;
};

export class ExampleText extends Component {
  public static componentName = 'example-text';

  public static dependencies = [
    ExampleChild as typeof Component,
  ]

  private myArray = [1, 2, 3, 4, 5];

  private randomNumber = Math.round(Math.random() * 10);

  public render(): HTMLElement {
    // eslint-disable-next-line no-console
    console.log('parent rendered');

    return this.html`
      <h1>H1 Headline</h1>
      <example-child
        my-callback=${childCallback}
        my-array=${this.myArray}
        my-second-array=${JSON.stringify(this.myArray)}
        my-interpolated="I like the number ${this.randomNumber} very much!"
      ></example-child>
    `;
  }
}

ExampleText.register();

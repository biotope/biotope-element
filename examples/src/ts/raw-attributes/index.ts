import Component from '@biotope/element';
import { ExampleChild } from './child';

export class ExampleText extends Component {
  public static componentName = 'example-text';

  public static dependencies = [
    ExampleChild as typeof Component,
  ]

  private myArray = [1, 2, 3, 4, 5];

  public render(): HTMLElement {
    // eslint-disable-next-line no-console
    console.log('parent rendered');

    return this.html`
      <h1>H1 Headline</h1>
      <example-child
        my-callback=${this.childCallback}
        my-array=${this.myArray}
        my-second-array=${JSON.stringify(this.myArray)}
      ></example-child>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  private childCallback(number?: number): string {
    const stringified = number >= 0 ? 'positive' : 'negative';
    return `Parent says that "${number}" is ${number !== 0 ? stringified : 'zero'}`;
  }
}

ExampleText.register();

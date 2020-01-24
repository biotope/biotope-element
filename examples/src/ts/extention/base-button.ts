// eslint-disable-next-line @typescript-eslint/triple-slash-reference,spaced-comment
/// <reference path="./locals.d.ts" />
import Component, { HTMLFragment } from '@biotope/element';

export class BaseButton extends Component {
  /* eslint-disable class-methods-use-this,no-alert */
  public greet(value): void {
    alert(value);
  }
  /* eslint-enable class-methods-use-this,no-alert */

  public render(): HTMLFragment {
    return this.html`
      <button>Hello</button>
    `;
  }
}

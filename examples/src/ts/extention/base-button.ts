// eslint-disable-next-line @typescript-eslint/triple-slash-reference,spaced-comment
/// <reference path="./locals.d.ts" />
/* eslint-disable class-methods-use-this,no-alert */
import Component, { HTMLFragment } from '@biotope/element';

export class BaseButton extends Component {
  public greet(value): void {
    alert(value);
  }

  public render(): HTMLFragment {
    return this.html`
      <button>Hello</button>
    `;
  }
}
/* eslint-enable class-methods-use-this,no-alert */

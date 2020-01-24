// eslint-disable-next-line @typescript-eslint/triple-slash-reference,spaced-comment
/// <reference path="./locals.d.ts" />

import Component, { HTMLFragment } from '@biotope/element';

export default class BaseButton extends Component {
  public greet(value) {
    alert(value);
  }

  public render(): HTMLFragment {
    return this.html`
      <button>Hello</button>
    `;
  }
}

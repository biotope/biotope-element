// eslint-disable-next-line @typescript-eslint/triple-slash-reference,spaced-comment
/// <reference path="./locals.d.ts" />

import Component, { HTMLFragment } from '@biotope/element';
import * as styles from './styles.scss';

class ExampleButton extends Component {
  public static componentName = 'example-button';

  protected styles = styles;

  public render(): HTMLFragment {
    return this.html`
      <button>Normal Button</button>
    `;
  }
}

ExampleButton.register();

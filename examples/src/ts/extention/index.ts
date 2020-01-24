// eslint-disable-next-line @typescript-eslint/triple-slash-reference,spaced-comment
/// <reference path="./locals.d.ts" />

import BaseButton from './BaseButton';
import * as styles from './styles.scss';

class ExampleButton extends BaseButton {
  public static componentName = 'example-button';

  protected styles = styles;
}

ExampleButton.register();

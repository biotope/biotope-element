import * as styles from './styles.scss';
import { BaseButton } from './base-button';

class ExampleButton extends BaseButton {
  constructor() {
    super();
    this.styles = styles;
  }
}

ExampleButton.componentName = 'example-button';
ExampleButton.register();

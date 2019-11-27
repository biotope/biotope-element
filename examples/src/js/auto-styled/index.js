import Component from '@biotope/element';
import * as styles from './styles.scss';

class ExampleButton extends Component {
  constructor() {
    super();
    this.styleContent = styles;
  }

  render() {
    return this.html`
      <button>Normal Button</button>
    `;
  }
}

ExampleButton.componentName = 'example-button';
ExampleButton.register();

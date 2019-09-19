import Component from '@biotope/element';
import template from './template.ejs';
import * as styles from './styles.scss';

export class ExampleSeparated extends Component {
  constructor() {
    super();

    this.template = template;
    this.styles = styles;
  }
}

ExampleSeparated.componentName = 'example-separated';
ExampleSeparated.attributes = [
  'paragraph',
];
ExampleSeparated.register();

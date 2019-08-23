import Component from '@biotope/element';
import template from './template.html';
import * as styles from './styles.scss';

const arrayOf = length => ([...Array(length)]);

export class ExampleSeparated extends Component {
  constructor() {
    super();

    this.template = template;
    this.styles = styles;
    this.numbersArray = arrayOf(5).map((_, index) => index);
  }

  handleClick(item) {
    return () => {
      // eslint-disable-next-line no-console
      console.log(item);
      // eslint-disable-next-line no-console
      console.log(this);
    };
  }
}

ExampleSeparated.componentName = 'example-separated';
ExampleSeparated.attributes = [
  'greeting',
  {
    name: 'show-slot',
    type: 'boolean',
  },
];
ExampleSeparated.getCustomArray = length => arrayOf(length).map((_, index) => index + 1);
ExampleSeparated.register();

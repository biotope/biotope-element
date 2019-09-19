// eslint-disable-next-line @typescript-eslint/triple-slash-reference,spaced-comment
/// <reference path="./locals.d.ts" />

import Component from '@biotope/element';
import template from './template.ejs';
import * as styles from './styles.scss';

export class ExampleSeparated extends Component {
  public static componentName = 'example-separated';

  public static attributes = [
    'paragraph',
  ];

  protected template = template;

  protected styles = styles;
}

ExampleSeparated.register();

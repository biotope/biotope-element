// eslint-disable-next-line @typescript-eslint/no-triple-slash-reference,spaced-comment
/// <reference path="./locals.d.ts" />

import Component from '@biotope/element';
import template from './template.ejs';

const arrayOf = <T>(length: number): T[] => ([...Array(length)]);

export class ExampleSeparated extends Component {
  public static componentName = 'example-template';

  public static attributes = [
    'greeting',
    {
      name: 'show-slot',
      type: 'boolean',
    },
  ];

  protected template = template;

  private numbersArray = arrayOf(5).map((_, index): number => index);

  private static getCustomArray(length: number): number[] {
    return arrayOf(length).map((_, index): number => index + 1);
  }

  private handleClick(item: number): EventListener {
    return (): void => {
      // eslint-disable-next-line no-console
      console.log(item);
      // eslint-disable-next-line no-console
      console.log(this);
    };
  }
}

ExampleSeparated.register();

import Component, { HTMLFragment } from '@biotope/element';

export class ExampleText extends Component {
  public static componentName = 'example-text';

  public render(): HTMLFragment {
    return this.html`
      <h1>H1 Headline</h1>
      <p>Hello World</p>
    `;
  }
}

ExampleText.register();

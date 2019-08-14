import Component from '@biotope/element';

export class ExampleText extends Component {
  public static componentName = 'example-text';

  public render(): ShadowRoot | HTMLElement {
    return this.html`
      <h1>H1 Headline</h1>
      <p>Hello World</p>
    `;
  }
}

ExampleText.register();

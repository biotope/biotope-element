import Component from '@biotope/element';

export class ExampleText extends Component {
  render() {
    return this.html`
      <h1>H1 Headline</h1>
      <p>Hello World</p>
    `;
  }
}

ExampleText.componentName = 'example-text';
ExampleText.register();

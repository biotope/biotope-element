import Component from '@biotope/element';

class MyButton extends Component<any, any> {
  static componentName = 'my-button';
  render() {
    this.html`
    <h1 class="my-button__headline">H1 Headline</h1>
    <p class="my-button__text">Hello World</p>`;
  }
}

MyButton.register();

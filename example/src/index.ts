import Element from '../../src/index';

class MyButton extends Element<any, any> {
  static componentName = 'my-button';
  static attributes = ['foo'];

  render() {
    this.html`
    <h1 class="my-button__headline">H1 Headline</h1>
    <p class="my-button__text">Hello World</p>`;
  }
}

MyButton.register();

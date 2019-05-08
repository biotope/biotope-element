# Styling

## Adding styles
As every component uses shadow dom by default, you have to put the styles inside the shadow root. You can either write inline styles:
```js
import Component from '@biotope/element';

class MyButton extends Component {
  render() {
    return this.html`
      <style>
        :host {
          background-color: orange;
        }
      </style>
      Hello World 🐤
    `;
  }
}

MyButton.componentName = 'my-button';

MyButton.register();
```

or import your css from an external file with some kind of bundler:
```js
import Component from '@biotope/element';
import style from './styles.css';

class MyButton extends Component {
  render() {
    return this.html`
      ${this.createStyle(style)}
      Hello World 🐤
    `;
  }
}

MyButton.componentName = 'my-button';

MyButton.register();
```

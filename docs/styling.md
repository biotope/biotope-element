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

!> __Important ⚠️:__ Style-Scoping only works in browsers that support shadow dom. Browsers like IE11/Edge V18 and older inherit styles as used everywhere else. So use unique class names and techniques like BEM to keep everything sane.

!> __Important ⚠️:__ If you come across that issue, that your styles are displayed as text. Most likely you use a class-name that is the same as your component name. Together with the polyfill, the style tag itself get styled which causes the issue in IE11/Edge V18 and below.

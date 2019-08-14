# Styling

## Adding styles
As every component uses Shadow DOM by default, you have to put the styles inside the shadow root. You can either import your css from an external file (recommended way for bio-element). In this case your imported style has to be a string with the css inside:

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

or use inline styles:

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

!> __Important ⚠️:__ Style-Scoping only works in browsers that support Shadow DOM. Browsers like IE11/Edge until V18 inherit styles as used everywhere else. So use unique class names and techniques like [BEM](http://getbem.com)to keep everything sane.

!> __Important ⚠️:__ If you come across that issue, that your styles are displayed as text. Most likely you use a class-name that is the same as your component name. Together with the polyfill, the style tag itself get styled which causes the issue in IE11/Edge V18 and below.

## Dynamic styles
If your styles are dynamic and depending on some values in the javascript context, just use inline styles in your template string. It is recommended to use this as little as possible.

```js
import Component from '@biotope/element';

class MyButton extends Component {
  color: 'orange';
  render() {
    return this.html`
      <style>
        :host {
          background-color: ${this.color};
        }
      </style>
      Hello World 🐤
    `;
  }
}

MyButton.componentName = 'my-button';

MyButton.register();
```

!> __Important ⚠️:__ If you come across that issue, that your styles are displayed as text. Most likely you use a class-name that is the same as your component name. Together with the polyfill, the style tag itself get styled which causes the issue in IE11/Edge V18 and below.

## Styling slots
If you want to style slotted content, you can so by using the `::slotted` pseudoselector. For a guideline, have a look [here](https://developer.mozilla.org/en-US/docs/Web/CSS/::slotted). Please note(!) only [simple selectors, pseudo classes and pseudo elements](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) can be used in the slotted pseudoselector:
```css
::slotted(span) {
  /* this will work */
  border: 1px solid black;
}

::slotted(span::before) {
  /* this will work too */
  border: 1px solid black;
}

::slotted(span + input) {
  /* this will not work */
  border: 1px solid black;
}
```
> __Note 📝:__ Slotted styles are not supported in IE11/Edge V18 and below. So for these browsers you need to use normal child selectors, as there is no slotting. `custom-element > span` will work for a slotted span.

## Style guidelines
You might have already heard of BEM. If not, take a look [here](http://getbem.com/introduction/)  
You want to use BEM inside your more components styles. This way you will keep an overview.  
In simple ones, you may even omit class names at all. I.e. a simple button component might not even need a class, if it just renders a button tag. This can simply be styled as `generic-button > button` as there will be no other button inside.

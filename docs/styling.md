---
id: styling
title: Styling
---

Web components use a shadow DOM to write their HTML. The shadow DOM has some interesting features
that make it very different from writing to an element using `innerHTML`. Styling-wise, the shadow
DOM scopes the style, so that styles from the page does not leak into the component and style and
vice-versa.

However, applying styles to any HTMLElement is just like applying styles to any `biotope-element`
component. You basically have two approaches: the `style` element and inline styling - with the same
advantages and disadvantages as normal HTMLElements.

__⚠️ Important:__ When adding styles to IE11 specifically, the browser will sometimes not fully
render the style you applied to your component even though your CSS is fully loaded onto the page.
This is easily solved by moving your CSS to the bottom of the component (like in all our examples).

__⚠️ Important:__ Style-scoping only works in browsers that require the Web Component polyfill.
Writing styles for these components is like writing styles for the entire page. So use unique class
names (for example [BEM](http://getbem.com)) or a build system that renames your classes to keep
your codebase maintainable and sane.

__⚠️ Important:__ Class names that are equal to your component name should also be avoided as the
Web Components polyfill also creates this class as part of the polyfilling process.

## Style element
Writing a `style` element to a `biotope-element` component is just as simple as writing another
`div`, like we've shown you before. Here's a simple example:

```javascript
// render function
return this.html`
  <div>
    Hello World 🐤
  </div>
  <style>
    color: red;
  </style>
`;
```

### createStyle function
We provide you with a pretty cool function to do most of this automatically - the `createStyle`
function. It can take either take a string (or an object with a `toString` function) and convert it
into a `style` element that you can use directly in your component.

Here is an example:

```javascript
// "style" variable
const style = 'color: red;';

// render function
return this.html`
  <div>
    Hello World 🐤
  </div>
  ${this.createStyle(style)}
`;
```

This will produce the same result as the previous example.

Additionally, as we mentioned before, this will also work if you give the `createStyle` function an
object that is "toStringable". This next example is equal to the one above.

```javascript
// "style" variable coming from a loader
// imported with, for example: import style from './styles.css';
const style = {
  // doesnt mater what's inside the object
};
style.toString = () => 'color: red;';

// render function
return this.html`
  <div>
    Hello World 🐤
  </div>
  ${this.createStyle(style)}
`;
```

This is extremely relevant and useful when you're using webpack or other build tools to load styles
into your Javascript files. With this function, `biotope-element` will be able to stringify whatever
a loader throws at you and print your CSS seamlessly.

__📝 Note:__ The `this.createStyle` function is also provided out of the box, like so:
```javascript
import Component, { createStyle } from '@biotope/element';
```

### Dynamic styles
Since a component is fully written in Javascript, it can be very tempting to just interpolate inside
the `style` element and add in your Javascript variable to the style. However, due to how the Web
Components polyfill works, this is a very bad practice as the modified style will get applied to the
entire page. This means that any component-specific state-dependant modification can be applied to
all components of a page.

To avoid this, either use a second class to add/modify some properties on a specific element or
use inline styles (shown in the next section).

Here is an example of adding a modifier class using the `classnames` package.

```javascript
import classnames from 'classnames';
…

// render function
const mainClasses = classnames('myMainClass', {
  'myMainClass--modifier': someValue,
});
return this.html`
  <div class=${mainClasses}>
    Hello World 🐤
  </div>
`;
```

## Inline styles
Whether you're a fan of css-in-js or not, `biotope-element` provides you a way to inline CSS in an
easy and maintainable way, just like css-in-js. Just send an object to the HTMLElement inside the
`style` property.

If we take the previous styling example, here is an example of how inline CSS can be done:

```javascript
// render function
return this.html`
  <div style=${{ color: 'red' }}>
    Hello World 🐤
  </div>
`;
```

In the same manner of css-in-js, and in order to have an easy dev experience in Javascript, any
kebab-cased CSS properties are available as camelCase, like so:

```javascript
// render function
return this.html`
  <div style=${{ marginTop: '10px' }}>
    Hello World 🐤
  </div>
`;
```

## The host SCSS mixin
Web Components are very special in terms of what and how you can use CSS. One of the special
selectors available for Web Components is the `:host` selector. This selector is very useful when
writing CSS for your component as it can select the component itself.

Unfortunately, on browsers that require the Web Component polyfills, this selector is not available.
We provide you with a `host` scss mixin that tries to counter this problem.

Here is how you can use it in a component named "my-button":

```scss
@include host(my-button) {
  /* my component element CSS */
}
```

This mixin is just an example however - you can chose to use it, ignore it, modify it or port it to
another language very easily. The mixin will produce the following code:

```css
:host {
  /* my component element CSS */
}

my-button {
  /* my component element CSS */
}
```

The `:host` fule is there for modern browsers and the `my-button` rule is there mainly for IE11. The
reason why the code has to be repeated has to do with how browsers read and apply CSS rules. If IE11
encounters the following example, it will crash uppon reading the `:host` selector and will not
apply any of the rules we set.

```css
/* This breaks IE11 */
:host,
my-button {
  /* my component element CSS */
}
```

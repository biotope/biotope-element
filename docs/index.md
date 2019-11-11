---
id: index
title: Introduction
---

`biotope-element` is a library to create Web Components in a simple way, taking advantage of simple
yet powerful concepts from other frontend libraries to empower you, the developer, and your clients'
needs - be them integration with popular CMSs or developing amazing design-systems to be used
anywere.

`biotope-element` was developed using mostly vanilla web technologies and with the intention of
being used for component development and not page assembly. This means we dedicate ourselves to
making sure that page assembly libraries like React, Vue or Angular have the best possible
experience when using our components. This also means that every piece of knowledge you have about
HTMLElements is 100% valid and applicable when working with `biotope-element`.

This documentation aims at showing you how `biotope-element` works and how to create components
using it. It will also assume that you have no knowledge of what a Web Component is. This means we
will explain some Web Component concepts as we go along but not all and certainly not to an
unnecessary depth. You can read more about Web Components [here](https://www.webcomponents.org/introduction).

## Installation
You can install the biotope element in your project using npm:

```bash
npm install @biotope/element
```

or yarn

```bash
yarn add @biotope/element
```

After that, import it in your components like so:

```javascript
import Component from '@biotope/element';
```

## Your first component

To use `biotope-element`, you have to extend it with your custom class.

After defining your class, you have to call the `register` function. This function comes with
`biotope-element` and teaches the browser how to build your component. Here's a minimal example of
a working component:

```javascript
// my-button.js
import Component from '@biotope/element';

export class MyButton extends Component {
  render() {
    return this.html`
      Hello World 🐤
    `;
  }
}

MyButton.componentName = 'my-button';
MyButton.register();
```

After that you can use it in your html like so:

```html
<script src="my-button.js"></script>
<my-button></my-button>
```

This will result in the following html:

```html
<script src="my-button.js"></script>
<my-button>
  Hello world 🐤
</my-button>
```

Note: It's irrelevant where the `script` is placed. But remember that the component will only start
to render after the `script` is parsed and the component is registered.

## Compatibility and Polyfills

Natively, Web Components are not supported by all browsers - this includes `biotope-element`. You
can check out a list of compatible browsers using [caniuse](https://caniuse.com/#search=Custom%20Elements%20v1).

To get it to work almost all non-dead browsers, you can use [these polyfills](https://github.com/webcomponents/polyfills).
You can also checkout their [npm package](https://www.npmjs.com/package/@webcomponents/webcomponentsjs)
or you can simply put a script pointing to [unpkg](https://unpkg.com/@webcomponents/webcomponentsjs@2.3.0/webcomponents-loader.js)
which will load only the necessary polyfills.

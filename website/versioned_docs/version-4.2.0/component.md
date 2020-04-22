---
id: version-4.2.0-component
title: Component and Rendering
original_id: component
---

We trust in the web.

`biotope-element` is an extension of a vanilla HTMLElement with some nice features on top. So
everything you build using `biotope-element` is a component. Anything else you need can be grabbed
from other libraries.

In this sense, a component is a piece of a UI that you can use and re-use throughout your
application to deliver a consistent UI. Buttons, sliders, accordions, menus, content boxes, … all
of these can be single components that you can build using `biotope-element`. They can include
custom information structure (HTML), styles (CSS) and functionality (JS).

## Base component
All `biotope-element` components need at least 3 things to run:
  1. A class that extends `Component` (the base class provided by `biotope-element`)
  2. A component name so the browser knows what tags to build your component on
  3. The `register` function to be called

So basically here is a component that works perfectly in the browser but does nothing (yet):

```javascript
// my-button.js
import Component from '@biotope/element';

class MyButton extends Component {}

MyButton.componentName = 'my-button';
MyButton.register();
```

The `register` function teaches the browser how to build your component and is responsible for
adding a bunch of functionality that needs to be available at the time of instantiation. It can also
take an argument to output registration warnings to the console, like so:

```javascript
// Here, no warnings are logged
MyButton.register(true);

// Here, we're going to try to register the component again
MyButton.register(true);
// Which will cause this warning to be output to the console:
// > Warn: Attempt to re-register component "my-button". Skipping…
```

## Rendering
The `render` function was designed to complement the concept of Web Components and take it to the
next level. It provides you with a simple and intuitive way to render information inside the
component.

Every component implements a `render` function. Inside it, you need to call and return the `this.html`
function on a template literal to add HTML to your component:

```javascript
// my-button.js
import Component from '@biotope/element';

class MyButton extends Component {
  render() {
    // this will add 'Hello World 🐤' to the root of the element
    return this.html`
      <div>
        Hello World 🐤
      </div>
    `;
  }
}

MyButton.componentName = 'my-button';
MyButton.register();
```

This new HTML code will be added to the shadow DOM (think of this process as something similar to
writing a string to the `innerHTML` property of a HTMLElement). The result of the code above is the
following:

```html
<my-button>
  <div>
    Hello World 🐤
  <div>
</my-button>
```

## Partials
The `html` function can be used to convert string HTML to actual HTML components. In this sense, if
you need to render a non-HTML string, then you can simply interpolate it inside the template string
that you pass to the `this.html` function. You can even use regular JavaScript - inline conditions
are your friends ;)

Here's an example:

```javascript
// render function
return this.html`
  <div>
    Hello ${true ? 'World' : 'never'} 🐤
  </div>
`;
```

However, if you need to output actual HTML, you can re-use the `html` function to create as many
partials as you want. Here's an example with a partial:

```javascript
// some other file or function
const myPartial = () => this.html`
  <span>World</span>
`;

// render function
this.html`
  <div>
    Hello ${true ? myPartial() : 'never'} 🐤
  </div>
`;
```

The `html` function returns something that can be rendered into an HTMLElement(s). However, it is
not an HTMLElement yet - so you cannot call any HTMLElement function on it (like `addEventListener`
for example).

In spite of this, the `html` function allows you to add any HTMLElements you wish, wherever you
want. Here's a simple example:

```javascript
// render function inside a "my-button" component
const myElement = document.createElement('button');
myElement.innerHTML = 'Click me!';
myElement.addEventListener('click', console.log);

return this.html`
  <div>${myElement}</div>
`;
```

This will result in:

```html
<my-button>
  <div><button>Click me!</button></div>
</my-button>
```

And clicking the button will result in the click event being printed to the console, as expected.

> __📝 Note:__ We also provide the `this.html` function out of the box, should you need it, like so:
```javascript
import Component, { html } from '@biotope/element';
```

> __⚠️ Important:__ When creating partials, altering the HTML structure of the `this.html` that
consumes that partial (i.e. adding/removing nodes before the partial is used) will trigger the
elements inside the partial to be re-rendered. To avoid this, you can use the `this.html.for`
function to hard-wire the elements and prevent the re-render or simply don't alter the HTML
structure - CSS is your friend here. More documentation in [this link](https://github.com/WebReflection/lighterhtml#whats-the-api--whats-in-the-export-).

### Loops
It is generally a good idea to split your render function into multiple pieces otherwise it may end
up too messy. You can do this by using `this.html` as many times as you want. Only when the result
of that function gets returned in `render`, does the DOM get updated. Here is an example of partials
being built on a loop.

```javascript
// render function inside a "my-button" component
const myArray = [1, 2, 3, 4];

return this.html`
  <div># Here are ${myArray.length} divs on a loop</div>
  ${myArray.map(number => this.html`
    <div>Hey! I'm div number ${number}</div>
  `)}
  <div># All done!</div>
`;
```

The result would be:

```html
<my-button>
  <div># Here are 4 divs on a loop</div>
  <div>Hey! I'm div number 1</div>
  <div>Hey! I'm div number 2</div>
  <div>Hey! I'm div number 3</div>
  <div>Hey! I'm div number 4</div>
  <div># All done!</div>
</my-button>
```

### Raw HTML
You may have the necessity for creating partials from a raw string that contains raw HTML, like when
you import an `svg` from a file.

In this scenario, you can simply do this to render it:

```javascript
import svg from './chevron.svg';

// render function
return this.html`
  <div>
    ${{ html: svg }}
  </div>
`;
```

Considering that the import will return an `svg` in a string, this render function will create a `div`
with an `svg` element inside. This is effectively the same as creating an element with `document.createElement`
and inserting it directly like so:

```javascript
import svg from './chevron.svg';

// render function
const containerElement = document.createElement('div');
containerElement.innerHTML = svg;
const svgElement = containerElement.children[0];

return this.html`
  <div>
    ${svgElement}
  </div>
`;
```

The only difference between these two approaches is that, while `document.createElement` is slower
than inserting the element through `{ html: … }`, it will allow you to perform any native
HTMLElement action (like `addEventListener` or `classList.add`).

The downside of these two approaches is that the `svg` element will always be re-rendered when the `render`
function is called, even if nothing inside the svg element changes.

To counter this we provide you with a `createRaw` function that creates a full partial out of the
string. You can call it once and use it in wherever component you want as it will always render a
different HTMLElement.

```javascript
import svg from './chevron.svg';
const svgElement = createRaw(svg);

// render function
return this.html`
  <div>
    ${svgElement}
  </div>
`;
```

The `createRaw` function will create a fragment that is re-usable and will not be re-rendered.
However, like the `{ html: … }` approach, you will not be able to perform any native HTMLElement
action on it.

> __📝 Note:__ We provide the `createRaw` function both out of the box and inside the component,
should you need it, like so:
```javascript
import Component, { createRaw } from '@biotope/element';

class MyButton extends Component {
  render() {
    this.createRaw(…)
    …
  }
}
```

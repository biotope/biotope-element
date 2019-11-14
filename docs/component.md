---
id: component
title: Component
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

> __⚠️ Important:__ You need to create the `render` function when you define your class so that it is
already available during the component registration phase. This means you **cannot** simply do:

```javascript
// my-button.js
import Component from '@biotope/element';
import { template } from './template';

class MyButton extends Component {
  // this won't work
  render = template
}

MyButton.componentName = 'my-button';
MyButton.register();
```

If you implement the example above, the `render` function will only be set during the constructor,
and not when calling the `register` function. This will also cause your component to render nothing.

### Partials
The `html` function can be used to convert string HTML to actual HTML components. In this sense, if
you need to render a non-HTML string, then you can simply interpolate it inside the template string
that you pass to the `this.html` function. You can even use regular Javascript - inline conditions
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

## Attributes
This is the main way of passing information to any component.

Every component has its own attributes. If you have any experience with adding for example
`class`es, `id`s, `src`s or `data-*` attributes on regular HTMLElements, then you already know how
to add/modify/remove attributes in`biotope-element`.

To add or modify an attribute to a `biotope-element` component, you can simply do:

```html
<my-button></my-button>
<script>
  const myElement = document.querySelector('my-button');
  myElement.setAttribute('example-attribute', 'Hello Foo World');
</script>
```

Which will result in:

```html
<my-button example-attribute="Hello Foo World"></my-button>
<script>
  const myElement = document.querySelector('my-button');
  myElement.setAttribute('example-attribute', 'Hello Foo World');
</script>
```

Additionally, you can use a short notation that we provide in `biotope-element`.

```javascript
myElement.setAttribute('example-attribute', 'Hello Foo World');
// is the same as
myElement.exampleAttribute = 'Hello Foo World';
// also the same as
myElement['example-attribute'] = 'Hello Foo World';
```

All three of these instructions will result in the same HTML.

Likewise, to remove attributes, you can use native Javascript:

```html
<my-button example-attribute="Hello Foo World"></my-button>
<script>
  const myElement = document.getElementsByTagName('my-button');
  myElement.removeAttribute('example-attribute');
  // is the same as
  myElement.exampleAttribute = null;
  // also the same as
  myElement['example-attribute'] = null;
</script>
```

Which will result in:

```html
<my-button></my-button>
```

> __📝 Note:__ Passing non-string attributes through the shorthand notation we provide is possible,
however they will not be printed in the HTML - instead, they will just be passed to the props. You
can learn more about props in the next section.

### Props
Since attributes are the main API for passing information to your component, we decided to add props
to our components to simplify and streamline this process. This means that, props are the result of
picking and parsing of all the attributes of the component. However, this is only efficient if the
component knows which attributes to watch and which ones to ignore.

A prop change will always trigger a new render. Consider this next example component, with a `greet`
attribute. We can customize the greeting message the component outputs by sending it through that
same attribute and accessing it in the prop.

```javascript
// my-button.js
import Component from '@biotope/element';

class MyButton extends Component {
  render() {
    return this.html`
      <div>
        ${this.props.greet} 🐤
      </div>
    `;
  }
}

MyButton.componentName = 'my-button';
MyButton.attributes = ['greet']; // Here are the attributes that should be watched
MyButton.register();
```

By adding this HTML to the page:

```html
<script src="my-button.js"></script>
<my-button greet="Hello Foo World"></my-button>
```

The output will be:

```html
<script src="my-button.js"></script>
<my-button greet="Hello Foo World">
  <div>
    Hello Foo World 🐤
  <div>
</my-button>
```

Adding other attributes to elements inside the `render` function is also possible - and so is
interpolating attributes or content. Notice that attributes in HTML are written in kebab-case,
however when used inside `this.props`, they can be accessed through camelCase.

```javascript
// my-button.js
import Component from '@biotope/element';

class MyButton extends Component {
  render() {
    return this.html`
      <div>
        ${this.props.greet} 🐤
      </div>
      <div class="my-${this.props.customClass}">
        Some ${this.props.text}
      </div>
    `;
  }
}

MyButton.componentName = 'my-button';
MyButton.attributes = [
  'greet',
  'custom-class',
  'text',
];
MyButton.register();
```

```html
<script src="my-button.js"></script>
<my-button
  greet="Hello Foo World"
  custom-class="fancy-class"
  text="extra content"
></my-button>
```

The above code will output the following:

```html
<script src="my-button.js"></script>
<my-button
  greet="Hello Foo World"
  custom-class="fancy-class"
  text="extra content"
>
  <div>
    Hello Foo World 🐤
  </div>
  <div class="my-fancy-class">
    Some extra content
  </div>
</my-button>
```

### Default Props
Default props are exactly what they sound like. They are the values of props when no attributes are
set. This is an important mechanic for you, the developer, to avoid a lot of `if`s to check whether
a prop exists, can be accessed and used.

`defaultProps` are only set once. This means that you shouldn't treat them as fallback values for
your props every time you set/reset them. They are rather just initial values.

Looking at this example:

```javascript
// my-button.js
import Component from '@biotope/element';

class MyButton extends Component {
  constructor() {
    super();
    this.defaultProps = {
      greet: 'Hello World',
    };
  }

  render() {
    return this.html`
      <div>
        ${this.props.greet} 🐤
      </div>
    `;
  }
}

MyButton.componentName = 'my-button';
MyButton.attributes = ['greet'];
MyButton.register();
```

```html
<script src="my-button.js"></script>
<my-button></my-button>
```

The above code will output the following:

```html
<script src="my-button.js"></script>
<my-button>
  <div>
    Hello World 🐤
  </div>
</my-button>
```

And after you change that attribute normally:

```html
<script src="my-button.js"></script>
<my-button greet="Hello Foo World">
  …
</my-button>
```

The result will be as expected:

```html
<script src="my-button.js"></script>
<my-button greet="Hello Foo World">
  <div>
    Hello Foo World 🐤
  </div>
</my-button>
```

## State
Every component can have its own internal state. This internal state should be used the same way as
other frontend libraries (like React). Basically, the sum of `props` and `state` should reflect all
the information of a component. The HTML that is rendered should just be a reflection of these two
variables and should not add to it in any way.

A state change will always trigger a new render. The state of a component can be changed using the
`setState` function. Let's take this next example of a simple component that, after the user clicks
the button, the component changes its state to reflect it.

```javascript
// my-button.js
import Component from '@biotope/element';

class MyButton extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { userClicked } = this.state;
    return this.html`
      <div>
        The user has${!userClicked ? ' not' : ''} clicked me!
        The type of "userClicked" is ${typeof userClicked}.
      </div>
      <button onclick=${this.handleClick}>Click me!</button>
    `;
  }

  handleClick() {
    this.setState({
      userClicked: true,
    });
  }
}

MyButton.componentName = 'my-button';
MyButton.register();
```

Initially, the component will look like the following:

```html
<my-button>
  <div>
    The user has not clicked me!
    The type of "userClicked" is undefined.
  </div>
  <button>Click me!</button>
</my-button>
```

And after the state change, it will show:

```html
<my-button>
  <div>
    The user has clicked me!
    The type of "userClicked" is boolean.
  </div>
  <button>Click me!</button>
</my-button>
```

Alternatively to setting the state using an object (like in the example above), you can also do it
by passing a function. This function will receive the current state and should return the new state.
This can be very useful when programming in a functional approach. Here's an example:

```javascript
const increment = ({ counter }) => ({
  counter: counter + 1,
});

class MyButton extends Component {
  incrementCounter() {
    // this will take the current counter and increment it y 1
    this.setState(increment);
  }

  render() {
    …
  }
}
```

The `setState` function is a synchronous process, so right after it's finished, you can be sure the
component has re-rendered and DOM has been updated.

> __⚠️ Important:__ Do not try to update the state inside the render function or inside any function
that is called by the render function as this can lead to infinite render loops!

### Default State
The `defaultState` property follows the same mechanic as the `defaultProps`. They are the initial
values for your state.

Looking at the same example as above:

```javascript
// my-button.js
import Component from '@biotope/element';

class MyButton extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);

    this.defaultState = {
      userClicked: false,
    };
  }

  render() {
    const { userClicked } = this.state;
    return this.html`
      <div>
        The user has${!userClicked ? ' not' : ''} clicked me!
        The type of "userClicked" is ${typeof userClicked}.
      </div>
      <button onclick=${this.handleClick}>Click me!</button>
    `;
  }

  handleClick() {
    this.setState({
      userClicked: true,
    });
  }
}

MyButton.componentName = 'my-button';
MyButton.register();
```

which will initially render this (**⚠️ notice the initial type change!**):

```html
<my-button>
  The user has not clicked me!
  The type of "userClicked" is boolean.
</my-button>
```

But after the user clicks the button, the component will re-render to:

```html
<my-button>
  The user has clicked me!
  The type of "userClicked" is boolean.
</my-button>
```

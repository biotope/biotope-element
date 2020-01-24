---
id: attributes
title: Attributes, Props and State
---

These three concepts are responsible for containing all the information relative to your component.
Two components of the same `class` should have a different behavior if they are have different
attributes, props or state. On the other hand, if they have the same attributes, props and state,
the components should behave in the same way and should display the same HTML.

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

Likewise, to remove attributes, you can use native JavaScript:

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

## Props
Attributes are the main API for passing information to your component. However, they can only be
strings. Since this is not useful for a frontend application, we decided to add the `props` concept
to our components to simplify and streamline the process of watching and converting attributes.

This means that, `props` are the result of picking and parsing of all the attributes of the
component. A prop change will always trigger a new render. However, this is only efficient if the
component knows which attributes to watch and which ones to ignore.

Consider this next example component, with a `greet` attribute. We can customize the greeting
message the component outputs by sending it through that same attribute and accessing it in the
prop.

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
however when used inside `this.props`, they can only be accessed with camelCase.

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

---
id: references
title: References
---

`biotope-element` provides a very easy and familiar reference API, courtesy of `lighterhtml`'s API.
If you have any knowledge of how references work in libraries like React, then you'll feel right at
home.

References are basically objects that represent DOM elements in Javascript. It's like doing a `document.getElementById(…)`
on an element that has an `id` attribute and storing the return value in a variable - and then
every time that element is rewritten, the variable pointing to it gets updated.

Usually, and due to how Javacript memory allocation and pointers work, a reference is usually an
object that looks like this:

```javascript
const input = {
  current: …
};
```

The `current` property stores a pointer to the DOM element and it gets rewritten every time that
DOM element is recreated. This means that you can send the `input` variable to any function at one
point in time and, if the element it's storing gets updated, only the `current` value would be
overwritten.

`biotope-element` allows you to write references when rendering your component so that later you can
access them and do anything with them without the need to use functions like `getElementByClassNames`
or `querySelector`s.

References are immediately available after a `render` is finished, which means that the `rendered`
hook is the ideal place to use them. We advise developers to store any and all references to
elements in a single `refs` variable inside your component, so that you can store/get them safely.

## createRef
This is a helper function that creates simple reference objects for you so that you don't need to
manually do this yourself.

If we want to create a reference for an input for example, we create a `refs` variable inside our
component and call `createRef` to create a reference.

```javascript
import Component, { createRef } from '@biotope/element';

class MyInput extends Component {
  constructor() {
    super();
    this.refs = {
      input: createRef();
    };
  }

  …
}

MyInput.componentName = 'my-input';
MyInput.register();
```

Now, in the `render` function, we attach the `input` reference to an actual input element.

```javascript
render() {
  return this.html`
    <input
      type="text"
      id=${Math.random()}
      ref=${this.refs.input}
    />
  `;
}
```

After each render, if the input element is in the DOM, then `this.refs.input.current` holds a
pointer to that input element. In a `rendered` hook we can do the following:

```javascript
rendered() {
  const { input } = this.refs;

  if (input.current) {
    // This will output whatever number the "Math.random" function returned
    console.log(input.current.getAttribute('id'));
  }
}
```

## createRefCallback
You have at least two ways of fetching DOM elements inside `biotope-element`s so far: references and
simple Javascript selectors (like `getElementBy…` and `querySelector` functions). And considering
the structure we're advising with the single `refs` object, then, if you need to actually use both
methods, then you would end up with two types of reference checks:

```javascript
this.refs = {
  input: createRef();
  secondInput: () => this.querySelector(…);
};

// Two ways of accessing references - not good!
const domElementOne = this.refs.input.current;
const domElementTwo = this.refs.secondInput();
```

This is where `createRefCallback` can simplify your code. It creates a similar structure to a normal
reference and sets it up so that when you're accessing the `current` property, you are running the
callback that you pass it.

```javascript
this.refs = {
  input: createRef();
  secondInput: createRefCallback(() => this.querySelector(…));
};

// One way of accessing references - very good!
const domElementOne = this.refs.input.current;
const domElementTwo = this.refs.secondInput.current;
```

Note that the `secondInput` is only calculated at the moment of access, so you always get the
"freshest" possible result, while a normal reference created with `createRef` will be calculated
once, right after each `render`.

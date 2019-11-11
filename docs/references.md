---
id: references
title: References
---

`biotope-element` provides a very easy and familiar reference API, courtesy of `lighterhtml`'s API.
If you have any knowledge of how references work in libraries like React, then you'll feel right at
home.

## createRef

References are basically objects that you can access to get/set whatever you want on the DOM. It's
like having an automatic `querySelector` for a specific HTMLElement and accessing it whenever you
please.

```javascript
import Component, { createRef } from '@biotope/element';

class MyInput extends Component {
  constructor() {
    super();
    this.refs = {
      input: createRef();
    };
  }

  render() {
    return this.html`
      <input type="text" id=${Math.random()} ref=${this.refs.input} />
    `;
  }

  rendered() {
    const { input } = this.refs;
    // this "if" is not needed in this scenario - it's just a best practice :)
    if (input.current) {
      // This will output whatever number the "Math.random" function returned
      console.log(input.current.getAttribute('id'));
    }
  }
}

MyInput.componentName = 'my-input';
MyInput.register();
```

References are immediately available after a render, which means that in terms of references, the
`rendered` function is the ideal place to do/check whatever you want.

In the example above you can see that we use a `refs` object to keep all our reference objects. This
is ideal in order to have a cleaner and more accessible codebase.

## createRefCallback
In this sense, and in addition to `createRef`, we also provide `createRefCallback` that still lets
you create references using regular functions (should you ever need it). Here's an example:

```javascript
import Component, { createRef, createRefCallback } from '@biotope/element';

class MyInput extends Component {
  constructor() {
    super();
    this.refs = {
      input: createRef();
      secondInput: createRefCallback(() => this.shadowRoot.querySelector('.my-cute-input-class')),
    };
  }

  render() {
    return this.html`
      <input type="text" id=${Math.random()} ref=${this.refs.input} />
      <input type="number" id=${Math.random() + 1} class="my-cute-input-class" />
    `;
  }

  rendered() {
    const { input, secondInput } = this.refs;
    if (input.current) {
      console.log(input.current.getAttribute('id'));
    }
    // same usage as the "input" reference above!
    if (secondInput.current) {
      // This will output whatever number the "Math.random + 1" function returned
      console.log(secondInput.current.getAttribute('id'));
    }
  }
}

MyInput.componentName = 'my-input';
MyInput.register();
```

Notice that the `secondInput` is only calculated at the moment of access, so you always get the
"freshest" possible result, while a normal reference created with createRef will be calculated once,
right after each render.

We know you can probably guess how both these creators are built - they're very simple really. But
we still provide them so that you don't have to write your own in every project.

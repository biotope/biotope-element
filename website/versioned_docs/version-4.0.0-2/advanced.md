---
id: version-4.0.0-2-advanced
title: Advanced
original_id: advanced
---

## Partials and Loops
It is generally a good idea to split your render function into multiple pieces otherwise it may end
up too messy. You can do this by using `this.html` as many times as you want. Only when the result
of that function gets returned in `render`, does the DOM get updated. Here is an example of partials
being built on a loop.

```javascript
import Component from '@biotope/element';

class MyText extends Component {
  render() {
    const myArray = [1, 2, 3, 4];

    return this.html`
      <div># Here are ${randomNumber} divs on a loop</div>
      ${myArray.map(number => this.html`
        <div>Hey! I'm div number ${number}</div>
      `)}
      <div># All done!</div>
    `;
  }
}

MyText.componentName = 'my-text';
MyText.register();
```

The result would be:

```html
<my-text>
  <div># Here are 4 divs on a loop</div>
  <div>Hey! I'm div number 1</div>
  <div>Hey! I'm div number 2</div>
  <div>Hey! I'm div number 3</div>
  <div>Hey! I'm div number 4</div>
  <div># All done!</div>
</my-text>
```

## References
Biotope element provides a very easy reference API, courtesy of `lighterhtml`'s API. References are
basically objects that you can access to get/set whatever you want on the DOM. If you're familiar
with other libraries with refs, like React, you'll quickly pick this up. Example:

```javascript
import Component, { createRef } from '@biotope/element';

class XInput extends Component {
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

XInput.componentName = 'x-input';
XInput.register();
```

References are immediately available after a render, which means that in terms of references, the
`rendered` function is the ideal place to do/check whatever you want.

In the example above you can see that we use a `refs` object to keep all our reference objects. This
is ideal in order to have a cleaner and more accessible code base. In this sense, and in addition to
`createRef`, we also provide `createRefCallback` that still lets you create references using regular
functions (should you ever need it). Here's an example:

```javascript
import Component, { createRef, createRefCallback } from '@biotope/element';

class XInput extends Component {
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

XInput.componentName = 'x-input';
XInput.register();
```

Notice that the `secondInput` is only calculated at the moment of access, so you always get the
"freshest" possible result.

## Handling state
Every component can have its own internal state. To set the state just call the `setState` function
of the component with either the part of the state you with to update or a function (note: the
passed function will receive the current state as a parameter and must return the new one).
You can define `defaultState` as your initial state in the constructor. Note that `setState` will
trigger a new render.

If you're using typescript (or @babel/plugin-proposal-class-properties for example), you can also
declare `defaultState` as a property of your class - you can see an example of this commented below.

```javascript
import Component from '@biotope/element';

class MyButton extends Component {
  // NOTE: for typescript, @babel/plugin-proposal-class-properties or something similar
  // defaultState = {
  //   powermode: 'off',
  // }

  constructor() {
    super();

    // for simple non-fancy js users
    this.defaultState = {
      powermode: 'off',
    };
  }

  created() {
    this.addEventListener('click', this.onclick);
  }

  onclick() {
    // this will set the state on click
    this.setState({
      powermode: 'on',
    });
  }

  render() {
    return this.html`
      Powermode ${this.state.powermode}!
    `;
  }
}

MyButton.componentName = 'my-button';
MyButton.register();
```

```html
<my-button></my-button>
```

Result:
```html
<my-button>
  bar
</my-button>
```

In typescript, it would look like this:

```javascript
// typescript
import Component, { HTMLFragment } from '@biotope/element';

interface MyButtonState {
  powermode: 'on' | 'off';
}

class MyButton extends Component<object, MyButtonState> {
  public static componentName = 'my-button';

  protected readonly defaultState: MyButtonState = {
    powermode: 'off',
  }

  public created(): void {
    this.addEventListener('click', this.onclick);
  }

  public onclick(): void {
    // this will set the state on click
    this.setState({
      powermode: 'on',
    });
  }

  public render(): HTMLFragment {
    return this.html`
      Powermode ${this.state.powermode}!
    `;
  }
}

MyButton.register();
```

## Dependencies
Your component may need some other components to work. To allow the components to be registered when
you need them, you can define dependencies for every component:

```javascript
// typescript
import Component, { HTMLFragment } from '@biotope/element';

class XSlide extends Component {
  public static componentName = 'x-slide';

  public render(): HTMLFragment {
    return this.html``;
  }
}

class XSlider extends Component {
  public static componentName = 'x-slider';

  public static dependencies = [
    // Here the slider needs the slides to display correctly
    XSlide as typeof Component,
  ];

  public render(): HTMLFragment {
    return this.html`
      <x-slide></x-slide>
    `;
  }
}

// This will also register the XSlide component if not already registered
XSlider.register();
```

## Nesting components
You can also nest components inside the html and use the `children` accessor to get them in the root
component and manipulate them.

```javascript
// typescript
import Component, { HTMLFragment } from '@biotope/element';

class XSlide extends Component {
  public static componentName = 'x-slide';

  public render(): HTMLFragment {
    return this.html``;
  }
}

class XSlider extends Component {
  public static componentName = 'x-slider';

  public static dependencies = [
    XSlide as typeof Component,
  ];

  public render(): HTMLFragment {
    // Here we use this.children to access the three child x-slides
    return this.html`
      ${this.children.map(child => 'Slide')}
    `;
  }
}

XSlider.register();
```

```html
<x-slider>
  Slide
  Slide
  Slide
</x-slider>
```

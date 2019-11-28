---
id: lifecycle
title: Lifecycle Hooks
---

A `biotope-element` component goes through several lifecycle stages which have callbacks associated.
These callbacks can be used to add custom functionality on the different stage in the lifetime of
the component. As `biotope-element` is based on Web Components, it supports all lifecycle hooks from
Web Components.

However, we did a small adjustment on the timing of two of the hooks. But we'll get into more detail
on their sections.

## Hooks
When registering and rendering a component for the first time, you can expect the following hook
order:
  1. `constructor`
  2. `connectedCallback`
  3. `beforePropsChanged` (once per attribute)
  4. `attributeChangedCallback` (once per attribute)
  5. `afterPropsChanged` (once per attribute)
  6. `render`
  7. `rendered`

When a component is rendered and idle on the page and one of its attributes changes, these hooks are
called in this order:
  1. `beforePropsChanged`
  2. `attributeChangedCallback`
  3. `afterPropsChanged`
  4. `render`
  5. `rendered`

When the component is removed from the page, only the `disconnectedCallback` hook gets triggered.

Below we provide a simple explanation and simple examples of how all of these hooks work, when they
are called and what you should be doing on each one. This however does not replace any Web Component
hook documentation.

> __⚠️ Important:__ You need to create all the hooks when you define your class so that they are
already available when you call the `register` function. This means you **cannot** do:

```javascript
const connected = () => { /*…*/ };
const render = () => { /*…*/ };

class MyButton extends Component {
  // This does not work!
  connectedCallback = connected;
  // This does not work either!
  render = render;
}
```

> In this case, the `render` and `connectedCallback` hooks will only be set during the constructor,
and will not be available when the `register` function is called. This applies to all the hooks
described in this page!

### constructor
Simple enough to understand - just a class constructor.

This is the entry point for the creation of the instance of your component. Here are some examples
of things you can/should do in this function:
  - bind functions to the `this` context
  - apply any needed function debouncing
  - initialize some service you need (tracking for example)
  - set `defaultProps` and/or `defaultState`

### connectedCallback
This hook gets called once the component is already attached to the DOM. If the component is removed
from the DOM and re-attached to it, then this function gets called again.

This is where you can typically:
  - query the DOM (upwards or downwards)
  - add event listeners to the component itself
  - read/write to your slot (`innerHTML`) - if need be…

When this hook finishes, it emits a non-bubbling `connected` event with no `detail`.

> __⚠️ Important:__ In vanilla Web Components, this hook is called only **after** `attributeChangedCallback`.
In `biotope-element`however, this order is switched for render optimization purposes.

### attributeChangedCallback
This hook is called when an attribute has changed on the component. It can trigger a new render if
it determines that the props need to be changed. If they don't, no new render will be triggered.

This hook will be called once per attribute changed, even if two attributes change at the same time.

When all the "attributes hooks" finish (`beforePropsChanged`, `attributeChangedCallback` and
`afterPropsChanged`), it emits a non-bubbling `attributechanged` event with no `detail`.

> __⚠️ Important:__ This hook should only be overridden when you need to change the way a prop gets
updated - which is almost never the case if you're using the `attributes` property correctly.

### beforePropsChanged and afterPropsChanged
These hooks exist so that we can create functions to deal with attribute/prop changes in an explicit
way, without the need to override `attributeChangedCallback` and insert code before and after a
`super` call (that implicitly changes the `props` property).

As en example, both of the following components have the same behavior, but the first one is more
explicit about what the code is doing and where it's inserted in the component lifecycle.

```javascript
class MyButton extends Component {
  beforePropsChanged(...) {
    // runs before "this.props" is updated
  }
  afterPropsChanged(...) {
    // runs after "this.props" is updated
  }
}
```

```javascript
class MyButton extends Component {
  attributeChangedCallback(...) {
    // runs before "this.props" is updated
    super.attributeChangedCallback(...) // updates "this.props"
    // runs after "this.props" is updated
  }
}
```

### render
This is the first hook provided by `biotope-element`. It's responsible for returning the HTML that
results from the "variables" of the component (i.e. props, state, ...).

The returned HTML should fully represent the variables of the component. This means that two
components of the same class, with the same props and state should return the same HTML.
Side-effects are very much discouraged!

> __📝 Note:__ When creating a new component, you may have several calls to `attributeChangedCallback`
due to having inserted more than one HTML attribute before the component is connected to the DOM.
This will only result in one `render` being called though.

### rendered
This is the second hook provided by `biotope-element`. This hook will only be called when a `render`
has finished and the DOM has been updated. If two `render`s are called, this hook will also be
called twice.

This means that, in this hook, you can:
  - query the newly created element for anything you want
  - add some attributes that can only be added after a DOM element is rendered (like the `readonly` 
attribute on the native `input` element)
  - add some custom event listeners to the newly created elements

This hook emits a non-bubbling `rendered` event with no `detail` when both of the following
conditions are met:
  - the hook has finished
  - all children of this component are fully rendered and their DOM is already updated.

### disconnectedCallback
The counterpart of the `connectedCallback` hook. This hook gets called whenever a component leaves
the DOM. Just like `connectedCallback`, this hook will be called again if the component gets
attached and again detached from the DOM.

This hook is ideal for any cleanup operations you may need.

When this hook finishes, it emits a non-bubbling `disconnected` event with no `detail`.

## Examples
```javascript
// my-button.js
import Component from '@biotope/element';

export class MyButton extends Component {
  constructor() {
    super();
    console.log('C');
  }

  connectedCallback() {
    console.log('CC');
  }

  beforePropsChanged(name, previous, current) {
    console.log('BAC', name);
  }

  attributeChangedCallback(name, previous, current) {
    super.attributeChangedCallback(name, previous, current);
    console.log('ACC', name);
  }

  afterPropsChanged(name, previous, current) {
    console.log('AAC', name);
  }

  render() {
    console.log('R');
    return this.html`
      …
    `;
  }

  rendered() {
    console.log('RD');
    // do some event listener attaching here
  }

  disconnectedCallback() {
    console.log('DC');
    // do some cleanup here
  }
}

MyButton.componentName = 'my-button';
MyButton.attributes = ['text', 'another-text'];
MyButton.register();
```

### No attributes
Considering the component above, and given this next HTML:

```html
<my-button></my-button>
```

Then the outputs to the console would be:

```bash
> C
> CC
> R
> RD
```

If we then remove the element from the DOM, it would just output:

```bash
> DC
```

### Two attributes
Considering the component above, and given this next HTML:

```html
<my-button
  text="Hello"
  another-text="World"
></my-button>
```

Then the outputs to the console would be:

```bash
> C
> CC
> BAC text
> ACC text
> AAC text
> BAC another-text
> ACC another-text
> AAC another-text
> R
> RD
```

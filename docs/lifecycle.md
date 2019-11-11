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

## Hook order
When registering and rendering a component for the first time, you can expect the following hook
order:
  1. constructor
  2. connectedCallback
  3. attributeChangedCallback (if any attributes are present)
  4. render
  5. rendered

When a component is rendered and idle on the page and one of its attributes changes, these hooks are
called in this order:
  1. attributeChangedCallback
  2. render
  3. rendered

When the component is removed from the page, only the `disconnectedCallback` hooks gets triggered.

Below we provide a simple explanation and simple examples of how all of these hooks work, when they
are called and what you should be doing on each one. This however does not replace any Web Component
hook documentation.

## constructor
Simple enough to understand - just a class constructor.

This is the point of entry point for the creation of the instance of your component. Here are some
examples of things you can/should do in this function:
  - bind functions to the `this` context;
  - apply any needed function debouncing;
  - initialize some service you need (tracking for example)
  - set `defaultProps` and/or `defaultState`

## connectedCallback
This hook gets called once the component is already attached to the DOM. If the component is removed
from the DOM and re-attached to it, then this function gets called again.

This is where you can typically:
  - query the DOM (upwards or downwards)
  - add event listeners to the component itself
  - read/write to your slot (`innerHTML`) - if need be…

__⚠️ Important:__ In vanilla Web Components, this hook is called only **after** `attributeChangedCallback`.
In `biotope-element`however, this order is switched for render optimization purposes.

## attributeChangedCallback
This hooks is called when an attribute has changed on the component. It can trigger a new render if
it determines that the props need to be changed. If they don't, no new render will be triggered.

You can use this function for 2 main purposes. Here is an example:

```javascript
class MyButton extends Component {
  attributeChangedCallback(name, previous, current) {
    // Here, no props have changed yet
    // You can do any check you want on the "current" attribute

    super.attributeChangedCallback(name, previus, current)

    // Here, prop with the name in "name" has changed
    // You can access "this.props[name]" and the result is the value of "current"
    // Here you can do state changes if you need to update it based on the new prop
  }

  render() {
    // Will only be triggered if the "current" value is not equal to "previous"
    …
  }
}
```

This hook will be called once per attribute changed, even if two attributes change at the same time.

This is the only hook that requires you to call the `super` function in order to work as intended.
Remember to always call it, otherwise no props will get changed, unless you do it manually - we
don't advise it.

## render
This is the first hook provided by `biotope-element`. It's responsible for returning the HTML that
results from the "variables" of the component (i.e. props, state, ...).

The returned HTML should fully represent the variables of the component. This means that two
components of the same class, with the same props and state should return the same HTML.
Side-effects are very much discouraged!

__📝 Note:__ When creating a new component, you may have several calls to `attributeChangedCallback`
due to having inserted more than one HTML attribute before the component is connected to the DOM.
This will only result in one `render` being called though.

## rendered
This is the second hook provided by `biotope-element`. This hook will only be called when a `render`
has finished and the DOM has been updated. If two `render`s are called, this hook will also be
called twice.

This means that, in this hook, you can:
  - query the newly created element for anything you want
  - add some attributes that are can only be added after a DOM element is rendered (like the
`readonly` attribute on the native `input` element)
  - add some custom event listeners to the newly created elements

## disconnectedCallback
The counterpart of the `connectedCallback` hook. This hook gets called whenever a component leaves
the DOM. Just like `connectedCallback`, this hook will be called again if the component gets
attached and again detached from the DOM.

This hook is ideal for any cleanup operations you may need.

## Examples
```javascript
// my-button.js
import Component from '@biotope/element';

export class MyButton extends Component {
  constructor() {
    super();
    console.log('first');
  }

  connectedCallback() {
    console.log('second');
  }

  attributeChangedCallback(name, previous, current) {
    super.attributeChangedCallback(name, previous, current);
    console.log('third', name);
  }

  render(): HTMLFragment {
    console.log('fourth');
    return this.html`
      …
    `;
  }

  rendered() {
    console.log('fifth');
    // do some event listener attaching here
  }

  disconnectedCallback() {
    console.log('sixth');
    // do some cleanup here
  }
}

MyButton.componentName = 'my-button';
MyButton.attributes = ['text', 'another-text'];
MyButton.register();
```

## No attributes
Considering the component above, and given this next HTML:

```html
<my-button></my-button>
```

Then the ouputs to the console would be:

```bash
> first
> second
> fourth
> fifth
```

If we then remove the element from the DOM, it would just output:

```bash
> sixth
```

## Two attributes
Considering the component above, and given this next HTML:

```html
<my-button
  text="Hello"
  another-text="World"
></my-button>
```

Then the ouputs to the console would be:

```bash
> first
> second
> third texts
> third another-text
> fourth
> fifth
```

---
id: lifecycle
title: Lifecycle Hooks
---

A biotope element component goes through several lifecycle stages which have callbacks associated.
These callbacks can be used to add custom functionality in several point in the lifetime of the
component.

## customElement callbacks
A biotope element component is just an extension of the custom element spec. As such it inherits the
lifecycle callbacks of its parent class.
For these callbacks, please have a look at the
[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks).

Note: Typically in plain web-components, the `connectedCallback` method will be fired after the
initial attributes' callback (`attributeChangedCallback`). This is reversed in biotope-element. The
`connectedCallback` will always fire before any `attributeChangedCallback` is triggered. We do make
sure, however, that the render method is only fired once at startup (i.e. after all
`attributeChangedCallback` have finished).

## rendered
This method will be called when the DOM has been updated. If for example the render method is called
but you do not call `this.html` to print anything to the DOM, this function will not be called.

Note that when creating a new component, you may have several calls to `attributeChangedCallback`
due to having inserted more than one HTML attribute before the component is connected to the DOM.
Since `render` is only called once in this scenario, `rendered` will also only be called once.

## Simple example flow

- We add a custom component (built with biotope-element) on the page, with 2 attributes:
  1. `constructor`
  2. `connectedCallback`
  3. `attributeChangedCallback` (for the first attribute)
  4. `attributeChangedCallback` (for the second attribute)
  5. `render`
  6. `rendered`

- (maybe the user did something and) 2 seconds later we add a new attribute to the component:
  1. `attributeChangedCallback` (for the new attribute)
  2. `render`
  3. `rendered`

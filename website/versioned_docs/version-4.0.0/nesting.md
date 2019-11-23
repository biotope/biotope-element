---
id: version-4.0.0-nesting
title: Nesting
original_id: nesting
---

Your component may need some other components to work. This is called nesting components.

We've already established that for the browser to know what a component is and to know how to build
it, we need to register every single one of them. So, if your component has another as a dependency,
and that component has another one as a dependency, and so on… then we'd have a major problem where
our initial component would have to know this entire component hierarchy just to run itself.

This however is not the case.

When you use another component as a dependency of your component, `biotope-element` will ask this
child component to register itself and its dependencies, recursively.

We accomplish this through the use of the `dependencies` property. Here is an example:

```javascript
// my-button.js
import Component from '@biotope/element';
import { MyFancySpan } from './my-fancy-span';

class MyButton extends Component {
  render() {
    return this.html`
      <div>
        <my-fancy-span></my-fancy-span>
      </div>
    `;
  }
}

MyButton.componentName = 'my-button';
MyButton.dependencies = [
  MyFancySpan,
];
MyButton.register();
```

When a dependency is added to a component, and that component is registered, all its dependencies
are registered beforehand.

## Slotting
When nesting components inside another component, you start off with nothing more than just a simple
HTMLElement on your DOM. Let's take the previous example for nesting (above) - this is the initial
DOM:

```html
<my-button></my-button>
```

Then, when the component is rendered, a nested component is present in the DOM.

```html
<my-button>
  <div>
    <my-fancy-span></my-fancy-span>
  </div>
</my-button>
```

This representation is not completely accurate though. What actually happens is that the render
function renders the HTML inside of the shadow DOM, not the actual DOM. So, if after a render, you
query the element for it's `innerHTML`, you will still get an empty string.

This would be a more accurate representation of the DOM element after a render finishes:

```html
<my-button>
  # ShadowDOM {
    <!-- this is the shadow DOM (shown) -->
    <div>
      <my-fancy-span></my-fancy-span>
    </div>
  }
  <!-- this is the slot (not shown) -->
</my-button>
```

The slot (i.e. the `innerHTML`) is never shown when the component renders, even if it does contain
some content. However, when building a component that is, for example, a container that adds some
"box" styling, you would most likely want to put some content inside of it - and having the render
function contain that static HTML is probably not a good idea when you're dealing with CMSs.

In this sense, there is a special HTMLElement you can use - the `slot` element.

The `slot` element will basically create a portal where it will render the initial HTML you put in
the DOM before the component is rendered.

If we take the same example as before but with a `slot` element inside the render:

```javascript
// render function
return this.html`
  <div>
    <slot />
    <my-fancy-span></my-fancy-span>
  </div>
`;
```

And we set this initial element in the DOM:

```html
<my-button>
  <div>I am a little 🦋</div>
</my-button>
```

Then the rendered component (according to the previous shadow DOM notation we used), would be:

```html
<my-button>
  # ShadowDOM {
    <!-- this is the shadow DOM (shown) -->
    <div>
      <div>I am a little 🦋</div>
      <my-fancy-span></my-fancy-span>
    </div>
  }
  <!-- this is the slot (not shown) -->
  <div>I am a little 🦋</div>
</my-button>
```

However, the user would effectively only see the following:

```html
<my-button>
  <div>
    <div>I am a little 🦋</div>
    <my-fancy-span></my-fancy-span>
  </div>
</my-button>
```

Cool huh?

The slot can be put anywhere - as part of the root of your component, inside some HTML and even
inside other components (like the `my-fancy-span` component). In the latter case, it will then
become the slot for that component and `my-fancy-slot` can then re-use the `slot` element itself!

## Named slots
If you need to pass several "sections" of content to your component and you want the component to
organize them, you can do that by naming your `slot` elements.

If your component supports slot names:

```javascript
// render function
return this.html`
  First name: <slot name="first"></slot>
  Last name: <slot name="last"></slot>
```

By sending it some named content like so:

```html
<my-button>
  <span slot="first">John</span>
  <span slot="last">Doe</span>
</my-button>
```

Then your component would output the following:

```html
<my-button>
  First name: <span slot="first">John</span>
  Last name: <span slot="last">Doe</span>
</my-button>
```

Additionally, you can add some default values that will be shown if/while no slot of that name is
available. Here's an example:

```javascript
// render function
return this.html`
  <div>
    First name: <slot name="first">none</slot>
    Last name: <slot name="last">none</slot>
  </div>
```

This would output the following HTML if no slot with "first" and "last" names are provided:

```html
<my-button>
  First name: <slot slot="first">none</span>
  Last name: <slot slot="last">none</span>
</my-button>
```

> __📝 Note:__ This default functionality is not available if the slot is not named.

## Removing the shadow DOM
If for some reason you don't want to use the shadow DOM and want the component to directly output
the result of the `render` function to the `innerHTML`, then you can simply override the constructor
like so:

```javascript
// my-button.js
import Component from '@biotope/element';

class MyButton extends Component {
  constructor() {
    // this will signal biotope-element not to use shadow DOM
    super(false);
  }

  render() {
    return this.html`
      <div>I am a little 🐛</div>
    `;
  }
}

MyButton.componentName = 'my-button';
MyButton.register();
```

In this scenario, if you output the content of `innerHTML` of that component, instead of an empty
string, you will get the content of the `render` function.

This is not an ideal scenario due to how slotting and style scoping work in Web Components and
should be used only when you are absolutely sure of what you're doing.

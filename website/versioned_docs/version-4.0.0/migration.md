---
id: version-4.0.0-migration
title: Migration
original_id: migration
---

## Migrating from v3 to v4

### `emit` third argument changed
TLDR: `emit` has a new API. The third argument no longer adds a prefix to the event name. It's now a
`boolean` that represents whether the event should not bubble.

> __⚠️ Important:__ This is a **silent breaking change**! Make sure you update your `emit` calls!

v3 code:
```javascript
// 1) Sending a prefixed event with no "detail"
this.emit('pressed', undefined, true);

// 2) Sending a non-bubbling event with no "detail"
this.dispatchEvent(new CustomEvent('pressed', {
  bubbles: false,
}));
```

v4 code:
```javascript
// 1) Sending a prefixed event with no "detail"
this.emit('my-button-pressed');

// 2) Sending a non-bubbling event with no "detail"
this.emit('pressed', undefined, true);
```

### `wire` function removal and `html` function update
TLDR: `wire` function is gone - you can use `html` for everything now. The `render` function now
needs to return the result of `this.html`, otherwise nothing will get rendered.

v3 code:
```javascript
class MyComponent extends Component {
  renderPartial() {
    // The next line changed
    return this.wire()`
      <div>My Partial Div</div>
    `;
  }

  render() {
    // The next line changed
    this.html`
      <div>Main render function</div>
      ${this.renderPartial()}
    `;
  }
}
```

v4 code:
```javascript
class MyComponent extends Component {
  renderPartial() {
    // The next line changed
    return this.html`
      <div>My Partial Div</div>
    `;
  }

  render() {
    // The next line changed
    return this.html`
      <div>Main render function</div>
      ${this.renderPartial()}
    `;
  }
}
```

### `onPropsChanged` and `created` hooks removal
TLDR: `onPropsChanged` and `created` hooks were removed as they were redundant - you can use
`attributeChangedCallback` and `connectedCallback` to do the same thing, respectively.

v3 code:
```javascript
class MyComponent extends Component {
  created() {
    // Insert your "init code" here
  }
  onPropsChanged() {
    // Insert logic for attribute/prop changes
  }
}
```

v4 code:
```javascript
class MyComponent extends Component {
  connectedCallback() {
    // Insert your "init code" here - the element is in the DOM already
  }
  attributeChangedCallback(name, previous, current) {
    // Insert logic for attribute changes

    // This function updates the props
    super.attributeChangedCallback(name, previous, current);

    // Insert logic for prop changes
  }
}
```

### Bypassing attribute-to-prop conversion is not possible
TLDR: You can no longer set a `props` attribute when creating a component to pass all attributes.

v3 code:
```html
<my-component props=...></my-component>
```

v4 code:
```html
<my-component my-first-prop=... my-second-prop=...></my-component>
<script>
  // OR through js
  myComponent.myFirstProp = ...;
</script>
```

### `basedOn` feature removal
You can no longer use the `baseOn` feature. Please build the component you want using the `render`
function.

### `defaultProps` and `defaultState`
TLDR: You can now define `defaultProps` and `defaultState` as regular variables, instead of having
to do it in a getter.

v3 code:
```javascript
class MyComponent extends Component {
  get defaultProps() {
    return {
      // ...
    };
  }
}
```

v4 code:
```javascript
class MyComponent extends Component {
  constructor() {
    super();
    this.defaultProps = {
      // ...
    };
  }
}
// OR
class MyComponent extends Component {
  defaultProps = {
    // ...
  }
}
// OR
class MyComponent extends Component {
  get defaultProps() {
    return {
      // ...
    };
  }
}
```

### Member-access in TypeScript
Some class properties have changed their member-access. `observedAttributes` is now `private` and
is no longer accessible.

Here is a list of changes:
```javascript
class MyComponent extends Component {
  public static attributes;

  public props;
  protected state;
  protected readonly defaultProps;
  protected readonly defaultState;
}
```

### Automatic types
TLDR: no more converting strings to JavaScript types - just add a `type` property to each attribute
(manual converters still work).

v3 code:
```javascript
class MyComponent extends Component {
  ...
}

MyComponent.attributes = [
  'simple-text',
  {
    name: 'open',
    converter: prop => /* my manual conversion to boolean */,
  },
];
```

v4 code:
```javascript
class MyComponent extends Component {
  ...
}

MyComponent.attributes = [
  'simple-text',
  {
    name: 'open',
    type: 'boolean',
    /**
     * Also supports:
     * - string (default type)
     * - number
     * - object
     * - array
     * - function
     */
  },
];
```

### `rendered` hook and the `setTimeout` usage
This was never a good practice to begin with and there were alternatives for almost every case, but
now you have a way of doing this that is clean - the `rendered` hook and `ref`s (no `setTimeout`s!).

v4 code:
```javascript
import Component, { createRef } from '@biotope-element';

class MyComponent extends Component {
  constructor() {
    super();
    this.refs = {
      input: createRef(),
    };
  }

  render() {
    return this.html`
      <input value="Nice!" ref=${this.refs.input} />
    `;
  }

  rendered() {
    // Prints "Nice!"
    console.log(this.refs.input.current.value);
  }
}
```

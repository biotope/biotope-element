---
id: migration
title: Migration
---

## Migrating from v3 to v4

### `wire` function removal and `html` function update

TLDR: `wire` function is gone - you can use `html` for everything now. The `render` function now
needs it's return value to be the result of `this.html`, otherwise nothing will get rendered.

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

### Member-access in Typescript

Some class properties have changed their member-access.

Here is a list of changes:
```javascript
class MyComponent extends Component {
  public static attributes;
  private static observedAttributes;

  public props;
  protected state;
  protected readonly defaultProps;
  protected readonly defaultState;
}
```

### Automatic types

TLDR: no more converting strings to js types - just add a `type` property to each attribute (manual
converters still work).

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

## Adding biotope-element to a biotope project

### Change your typescript config
```json
{
  "compilerOptions": {
    "allowJs": true,
    "jsx": "React",
    "module": "es2015",
    "moduleResolution": "Node",
    "noImplicitAny": false,
    "sourceMap": true,
    "suppressImplicitAnyIndexErrors": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES5",
    "lib": [
      "es2017",
      "dom"
    ]
  },
  "awesomeTypescriptLoaderOptions": {
    "useCache": true,
    "reportFiles": [
      "src/**/*.{ts,tsx}"
    ]
  },
  "typeRoots": [
    "node_modules/@types",
    "src/types"
  ],
  "exclude": [
    "node_modules",
    "patterns",
    "test",
    "dist",
    ".tmp",
    "**/*.spec.ts"
  ]
}
```

### Add types for `*.scss` files and whatever custom loader you have for webpack.

Create a new file under `src/types` with the name `sass.d.ts` <-- actually that name doesn't matter.
```ts
declare module '*.scss' {
  const content: any;
  export default content;
}
```

### Change your biotope-build version
Run `npm install --save-dev @biotope/build@next`

### Add Biotope Element to your project
Run `npm install --save @biotope/element`

### Generate files with biotope cli
Run `npx @biotope/cli generate`

Follow the instructions, you may follow the naming pattern `XYourComponentName`

### Add polyfills for IE11 and Edge
Copy the following files from `node_modules/@webcomponents` to `src/resources/js/polyfills`
```js
'webcomponents-loader.js',
'bundles/webcomponents-ce.js',
'bundles/webcomponents-sd-ce-pf.js',
'bundles/webcomponents-sd-ce.js',
'bundles/webcomponents-sd.js'
```

Create a file in polyfills `object-assign.polyfill.js`

```js
if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}
```

Add some these lines to your `htmlhead.scripts.hbs`
```html
<script nomodule src="resources/js/polyfills/object-assign.polyfill.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/npm/whatwg-fetch@3.0.0/dist/fetch.umd.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"></script>

<script src="resources/js/vendor/custom-elements-es5-adapter.js"></script>
<script src="resources/js/polyfills/webcomponents-loader.js"></script>
```

Modify `projectConfig.js`
```js
global: {
  externalResources: {
    '@webcomponents/webcomponentsjs': [
      'custom-elements-es5-adapter.js'
    ]
  }
  uglify: {
    ignoreList: [
      'src/resources/js/polyfills/object-assign.polyfill.js',
      'resources/js/vendor/custom-elements-es5-adapter.js',
      'resources/js/polyfills/webcomponents-loader.js',
      'resources/js/polyfills/bundles/webcomponents-ce.js',
      'resources/js/polyfills/bundles/webcomponents-sd-ce-pf.js',
      'resources/js/polyfills/bundles/webcomponents-sd-ce.js',
      'resources/js/polyfills/bundles/webcomponents-sd.js'
    ]
  }
}
```

### Write your component

1. `npx @biotope/cli generate`
2. inside your the generated index.ts add new line `DemoComponent.register();` thats necessary to
*autoregister* the component
3. Use the component with resource loader
`<demo-component data-resources="[{paths: ['components/demo-component/index.js']}]"></demo-component>`


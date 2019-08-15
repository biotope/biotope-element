# Component

## The concept of a component

We trust in the web.

That's why we decided to write biotope and the biotope element with mostly vanilla web technologies
and polyfill it untill the right time is there.
On of these fancy new technologies is web components and all the proposals belonging to it (shadow
dom, custom elements, scoped styling).

Biotope element is just an extension of the vanilla html element which add some nice features.

So everything you build using the biotope element will be called a component in the following
documentation.

A component is a collection of functionality which could be reused.

## render()
As you can see in the hello world example every component implements a `render` function. In there
you can call `this.html` function on a template literal to add it to the components root:

```javascript
import Component from '@biotope/element';

class MyButton extends Component {
  render() {
    // this will add 'Hello World' to the root of the element
    return this.html`
      Hello World 🐤
    `;
  }
}

MyButton.componentName = 'my-button';
MyButton.register();
```

In the template literal you can also add valid html code as well as the `<slot>` tag where the
current content of the component will be placed. Read more about it in the [shadow dom](#shadow-dom)
section.

## props
Every component has its own props. The props can be passed into the component two ways:

You can use attributes or set the props via javascript:

### defaultProps
To give your props a default value you have to set the `defaultProps` getter of the component:
```javascript
import Component from '@biotope/element';

class MyButton extends Component {
  protected get defaultProps() {
    return {
      foo: 'bar',
    };
  }

  render() {
    return this.html`
      🎰 ${this.props.foo}
    `;
  }
}

MyButton.componentName = 'my-button';
MyButton.register();
```

```html
<my-button></my-button>
```

This will result in the following html:

```html
<my-button>🎰 bar</my-button>
```

### setting props
You can set the props of a component after initialisation by accessing its instance like this:
```html
<my-button id="foo"></my-button>
```

```javascript
document.getElementById('foo').props = {
  foo: 'bar'
}
```

Changing the props this way will trigger the render method.

## Attributes
To pass in data to a component attributes on the html tag can be used:

```html
<my-button foo="bar"><my-button>
```

To pass these values to the props object, you have to define the corresponding attribute in the
component:

```javascript
import Component from '@biotope/element';

class MyButton extends Component {
  render() {
    return this.html`🌸`;
  }
}

MyButton.componentName = 'my-button';
MyButton.attributes = ['foo'];

MyButton.register();
```

This will take care of the attributes value and pass it to the props of the component:

```javascript
import Component from '@biotope/element';

class MyButton extends Component {
  render() {
    return this.html`
      ${this.props.foo} 🌸
    `;
  }
}

MyButton.componentName = 'my-button';
MyButton.attributes = ['foo'];
MyButton.register();
```

This will result in the following html:

```html
<my-button foo="bar">
  bar 🌸
<my-button>
```

### Hyphen attributes
If your attributes get more complex, you might want to have multi word names like
`a-complex-attribute`.

To access those attributes in the props, you have to use the camelCase version of the string. In our
example this will be `aComplexAttribute`

```javascript
import Component from '@biotope/element';

class MyButton extends Component {
  render() {
    return this.html`
      ${this.props.anotherAttribute} 🌸
    `;
  }
}

MyButton.componentName = 'my-button';
MyButton.attributes =  ['another-attribute'];
MyButton.register();
```

This will result in the following html:

```html
<my-button another-attribute="Some simple value">
  Some simple value 🌸
<my-button>
```

### Transforming attributes
When you set values in the html tags attributes, these values will always be strings. If you pass
other data types through the attributes, something has to take care of their transformation. You can
do this by setting an attribute type or a custom converter function in the attributes array instead
of a simple string.

Attribute types are pre-defined conversion functions made available to developers so that you can
write more code that matters to your application and less code to parse strings. The types we offer
are `string`, `number`, `boolean`, `object` and `array`.
Take note that all of them will try to force the conversion. For example, if an attribute like
`'["a", "b"]'` is forced to an `object` type, it will be converted to `{0: 'a', 1: 'b'}`.

#### Example: Numbers
```html
<my-button fooNum="5"><my-button>
```

```javascript
import Component from '@biotope/element';

class MyButton extends Component {
  render() {
    // foo will now be a number
    return this.html`
      🚀 ${typeof this.props.fooNum}
    `;
  }
}

MyButton.componentName = 'my-button';
// use our pre-defined converters
MyButton.attributes = [{
  name: 'fooNum',
  type: 'number',
}];
// OR use your custom converter function
MyButton.attributes = [{
  name: 'fooNum',
  converter: (value) => parseInt(value, 10),
}];

MyButton.register();

```
This will result in the following html:
```html
<my-button fooNum="5">
  🚀 number
<my-button>
```

#### Example: Booleans
Passing in booleans is handled similarly, but instead of adding an string attribute you either add
the attribute or not. So your initial element might look like this:

```html
<my-button primary><my-button>
```

In this case "primary" equals true, when not passing in the attribute at all it equals false.
If your script looks like this...

```javascript
import Component from '@biotope/element';

class MyButton extends Component {
  render() {
    const { primary } = this.props;
    // primary will now be a boolean
    return this.html`
      💼 ${primary ? 'hello': 'goodbye'} ${typeof primary}
    `;
  }
}

MyButton.componentName = 'my-button';
MyButton.attributes = [{
  name: 'primary',
  type: 'boolean',
}];
MyButton.register();
```

...it will result in the following HTML:

```html
<my-button primary>
  💼 hello boolean
<my-button>
```

## Shadow dom
Every component extending the biotope element is using shadow dom. This will help you to not mess up
our existing component structure. If you have the following html and js:

```html
<my-button>
  I am a little 🦋
<my-button>
```

```javascript
import Component from '@biotope/element';

class MyButton extends Component {
  render() {
    // the slot will be replaced by the current content
    return this.html`
      <slot />
      <span>I am a little 🐛</span>
    `;
  }
}

MyButton.componentName = 'my-button';
MyButton.register();
```

It would result in this html:

```html
<my-button>
  I am a little 🦋
  <span>I am a little 🐛</span>
<my-button>
```

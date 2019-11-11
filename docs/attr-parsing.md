---
id: attr-parsing
title: Attribute Parsing
---

In regular HTMLElements, you can set attributes like `class`, `id`, `title`, `lang`, … These
attributes are all strings, as you might discover when trying to set one of them to a Javascript
object but you ending up with something like `class="[object Object]"`.

In Web Components, this is no different. However, `biotope-element` gives you the option to parse
these string values to any other type of object you want. This is achieved through the use of
automatic type converters or manual converter functions that you can set.

## Automatic type conversion
When defining a watched attribute in this documentation we've used simple strings inside an `attributes`
property, like so:

```javascript
MyButton.attributes = [
  'text',
];
```

However, if you want to add for example a "disabled" attribute and you want it to be a `boolean`
instead of a string, you can simply do:

```javascript
MyButton.attributes = [
  'text',
  { name: 'disabled', type: 'boolean' },
];
```

This will automatically try to force the value it receives into a javascript boolean type - it does
this according to the HTML5 spec so that all these conversions stay as true to the spec as possible.

The list of possible types is the following:
  - `string` (default when `type` is omitted)
  - `number`
  - `boolean`
  - `object`
  - `array`
  - `function`

__📝 Note:__ The difference between having just a `'text'` or a `{ name: 'text', type: 'string' }`
is definitely big - the former accepts any type of value without question, passing it through to the
props with no conversion, while the latter forces a conversion to a string, so the number `1` would
become a string with that number: `'1'`.

## Manual conversion
If your type is just too specific for it to be converted automatically (like an `enum` value that
only accepts certain strings or number), then you can use the `converter` property we provide and
set up your own conversion function.

```javascript
MyButton.attributes = [
  'text',
  {
    name: 'disabled',
    converter: (prop) => {
      // do your own conversion and return the result
    },
  },
];
```

Additionally, and because we don't want you to have to choose between the two types of attribute
parsing when developing, we also provide our automatic types converters for you to use in your
custom converter functions.

```javascript
import Component, { toBoolean } from '@biotope/element';
…
MyButton.attributes = [
  'text',
  {
    name: 'disabled',
    converter: (prop) => {
      return toBoolean(prop)
    },
  },
  // which would be the same as
  { name: 'disabled', type: 'boolean' },
];
```

The converters you can import and use out of the box are: `toBoolean`, `toString`, `toNumber`,
`toObject`, `toArray` and `toFunction`.

## Examples

### Numbers
```html
<my-button foo="5"><my-button>
```

```javascript
import Component from '@biotope/element';

class MyButton extends Component {
  render() {
    // foo will now be a number
    return this.html`
      🚀 ${typeof this.props.foo}
    `;
  }
}

MyButton.componentName = 'my-button';
// use our pre-defined converters
MyButton.attributes = [
  { name: 'foo', type: 'number' },
];
// OR use your custom converter function
MyButton.attributes = [{
  name: 'foo',
  converter: (value) => {
    console.log('A new prop just popped up…… get it?');
    return parseInt(value, 10);
  },
}];
MyButton.register();

```

This will result in the following html:

```html
<my-button foo="5">
  🚀 number
<my-button>
```

### Booleans
```html
<my-button primary><my-button>
```

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
MyButton.attributes = [
  { name: 'primary', type: 'boolean' },
];
MyButton.register();
```

This will result in the following html:

```html
<my-button primary>
  💼 hello boolean
<my-button>
```

## Nesting components
When you have nested components, you might need to pass some value from the parent component to the
child component.

With strings, this is easy: just set the attribute normally and you're good to go. Even your
favorite Search Engine will thank you since all string attributes get written to the DOM.

However, when dealing with non-string attributes this is not so easy as explained in the begining of
this section. The HTML5 way to accomplish this task would be for the parent component to convert the
value to a string, set it as a normal attribute on the child component and have the child component
parse it again as a proper non-string value. This can obviously become a very inneficient process.

`biotope-element` lets you pass a non-string attribute to another `biotope-element` seamlessly and
without any change for the developer. Here's an example:

```javascript
// my-form.js
// render function
const myArray = [1, 2, 3, 4];
return this.html`
  <my-button
    text=${'Hello World'}
    another-text="Hello World too"
    example-array=${myArray}
    another-attribute=${JSON.stringify(myArray)}
  ></my-button>
`;
```

If we now consider that the child treats `text` and `another-text` both as strings `example-aray`
and `another-array` both as of type "array", then we can safely deduce that the attribute `another-array`
will definitely take longer to parse due to being converted to/from string into an array.

This will however result in the attribute `example-array` not being printed to the HTML. The DOM
would look something like this:

```html
<my-form>
  <my-button
    text="Hello World"
    another-text="Hello World too"
    another-attribute="[1,2,3,4]"
  ></my-button>
</my-form>
```

This is especially important when passing functions to a child element since Javascript functions do
not retain their context when being converter to/from a string.

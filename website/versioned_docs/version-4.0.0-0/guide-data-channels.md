---
id: version-4.0.0-0-data
title: Data Channels
original_id: data
---

There are 3 ways to pass data to a component.
- directly
- HTML attributes
- slotting content

There are no rules when to use what, but here are some best practices:

## Directly
If you need to pass new data on the fly and you're not using anything fancy like React or Vue, you
just grab the element with your favourite `.getElementBy...` method and use the attribute as if it
were inside the element (use camelCase!). Nothing to it really. Here's an example:

```html
<!-- Very nice! -->
<custom-element></custom-element>
<script>
  document.getElementsByTagName('custom-element')[0].myAttribute = 'Hey! It changed!';
  // OR
  document.getElementsByTagName('custom-element')[0]['my-attribute'] = 'Hey! It changed!';
</script>
```

The result is a simple:

```html
<!-- Very nice! -->
<custom-element my-attribute="Hey! It changed!"></custom-element>
...
```

You can also pass javascript objects to the attributes if needed. They will still go through the
normal prop chain but our converters are prepared to deal with them. For example, if you have an
attribute with `type: 'array'`, and you do either of the two lines of code:
```javascript
document.getElementsByTagName('custom-element')[0].myArray = '[1,2,3]';
document.getElementsByTagName('custom-element')[0].myArray = [1,2,3];
```
the result will be the same. The difference is that the first one will take a bit longer since it
has to convert the string into an array.

Hint: this will also allow you to pass functions for any callbacks that you need.

Remember though that passing non-strings to the attributes will not result in attributes being set
in the DOM - don't let SEO bite you in the behind ;)

Note: the custom element needs to recognise the attribute in order for this method to work, i.e. it
needs to be defined in the `attributes` property of your class. Otherwise this won't result in any
change.

## HTML attributes
Just as simple as the method described above. To pass new attributes to you component you can always
use the native get/set attributes - `getAttribute`, `setAttribute` and `removeAttribute`. Example:

```html
<!-- Very nice! -->
<custom-element
  attribute-1="a string"
  attribute-2="true"
></custom-element>

<!-- Meh -->
<custom-element
  attribute-3='[{"key1": "value1","key2": "value2","key3": "value3"}]'
></custom-element>
```

```javascript
const element = document.getElementBy...(...);
element.setAttribute('attribute-1', 'another string');
```

This method and the one described above should be used for simple data types like `string`, `bool`
or `number`. Although you can pass json strings as HTML attributes, it seems kind of ugly in the
HTML:

```html
<!-- Meh -->
<custom-element
  attribute-3='[{"key1": "value1","key2": "value2","key3": "value3"}]'
></custom-element>
```

You can read more about the get/set/remove functions, over at the MDN pages:
- https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute
- https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
- https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute

## Slotting content
In case you want to pass HTML markup to the component, we recommend slotting it and handle it
externally:

```html
<!-- Clean! -->
<custom-element>
  <div slot="header">
    I am header content <span class="icon-arrow"></span>
  </div>
</custom-element>
```

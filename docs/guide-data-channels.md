# Data channels
There are 2 ways to pass data to a component.
- HTML attributes
- slotting content

There are no rules when to use what, but here are some best practices:

## HTML attributes
Best used for simple data types like `string`, `bool` or `number`.
Although you can pass json strings as HTML attributes, it seems kind of ugly in the HTML:

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

If you need to pass new data on the fly and you're not using anything fancy like React or Vue, you
can always get/set the attributes of any component through the native JS way - using `getAttribute`,
`setAttribute` and `removeAttribute`.
Example:

```javascript
const element = document.getElementBy...(...);
element.setAttribute('attribute-1', 'another string');
```

You can read more about it, over at the MDN pages:
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

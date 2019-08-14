# Data channels
There are several ways to pass data to a component.
- HTML attributes
- javascript props setting
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

## Javascript props setting
As javascript is made to handle the more complex data types like `arrays` and `objects`, it is more 
convenient to set this data by javascript.

```html
<custom-element attribute-1="a string" attribute-2="true"></custom-element>
```

```js
// Such nice!
document.querySelector('custom-element').props = {
  'attribute-3': [
    {
      key1: "value1",
      key2: "value2",
      key3: "value3"
    }
  ]
}
```

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

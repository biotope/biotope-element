---
id: experimental
title: Experimental
---

This is a list of new `biotope-element` features we have decided to experiment with. None of these
features will be available on the package itself so the regular use of the package is not affected.

If you want to give us feedback on these experiments, please do so on our issues on github. Each
experiment below will have it linked at the bottom.

> __⚠️ Important:__ We will do our best to keep these versions as stable as possible, but they are
still not recommended to be used in a production system as their API, availability and location may
change - which will most likely cause your build to stop working without warning.

## Templates
When you use `biotope-element`, you'll notice that our HTML looks like HTML but is in fact just a
template string with some variables thrown in. In the spirit of the "separation of concerns", we
have decided to experiment with a simple HTML-to-template-string parser.

We have decided to use the `ejs` file format in the next example as most editors will color-code
your code correctly. But you can import any file, as long as you do it via a string:

Example usage:
```javascript
// my-button.js
import Component from '@biotope/element';
import template from './my-button.ejs';

class MyButton extends Component {
  constructor() {
    super();
    // "template" is a simple string
    this.template = template;
  }
  // No need for a render function!
}
MyButton.attributes = ['greet'];
MyButton.register();
```
```html
<!-- my-button.ejs -->
<button><% this.props.greet %></button>
```

This will result in:

```html
<my-button greet="Hello World!">
  <button>Hello World!</button>
</my-button>
```

You can install it directly via our repo with `npm install biotope/biotope-element#templates` or by
modifying your package json like so:
```json
"@biotope/element": "biotope/biotope-element#templates"
```

You can find more examples under the `examples` folder of the `templates` branch on our repo (which
should be in your `node_modules/@biotope/element` folder if you've installed this version) -
specifically in folders `templating` and `separation-of-concerns` (available for both JavaScript and
TypeScript).

Link for github discussion: [Experiment: Templates](https://github.com/biotope/biotope-element/issues/232)

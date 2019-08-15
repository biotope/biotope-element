# Lifecycle callbacks

A biotope element component goes through several lifecycle stages which have callbacks associated.
These callbacks can be used to add custom functionality in several point in the lifetime of the
component.

## customElement callbacks
A biotope element component is just an extension of the custom element spec. As such it inherits the
lifecycle callbacks of its parent class.
For these callbacks, please have a look at the
[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks).

Note: When extending customElement callbacks, be sure to call the super function as well:
```javascript
  connectedCallback() {
    // call super to avoid shenanigans
    super.connectedCallback();

    // then do your logic :)
  }
```

## created
As biotope element extends
[Hyperhtml Element](https://github.com/WebReflection/hyperHTML-Element#the-class) it also inherits
its `created` lifecycle callback.
For documentation, please see the hyperhtml-Element docs.

Note: No need to call `super.created()` here - it's empty.

## rendered
This method will be called when the DOM has been updated. If for example the render method is called
but you do not call `this.html` to print anything to the DOM, this function will not be called.

Note that when creating a new component, you may have several calls to `attributeChangedCallback`
due to having inserted more than one HTML attribute before the component is connected to the DOM.
This will not cause `rendered` to be triggered more than once. On startup, `rendered` is prepared to
wait for all the attributes to have finished parsing and set on the component `props`. Once the
component is up-and-running though, any attribute/prop change will trigger the `rendered` method.

Note: No need to call `super.rendered()` here - it's empty.

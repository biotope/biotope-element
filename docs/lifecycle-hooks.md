# Lifecycle callbacks

A biotope element component goes through several lifecycle stages which have callbacks associated.
These callbacks can be used to add custom functionality in several point in the lifetime of the component

## customElement callbacks
A biotope element component is just an extension of the custom element spec. As such it inherits the lifecycle callbacks of its parent class.
For these callbacks, please have a look at the [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks).

## created
As biotope element extends [Hyperhtml Element](https://github.com/WebReflection/hyperHTML-Element#the-class) it also inherits its `created` lifecycle callback.
For documentation, please see the hyperhtml-Element docs.

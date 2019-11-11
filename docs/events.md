---
id: events
title: Events
---

Events in HTMl are used for communication between your components and the outside world

In `biotope-element`, we use the native CustomEvent implementation, so you can expect no shenanigans
and no magic behind the scenes - just pure unadulterated Javascript… and a helper function to help
you out.

We'd also like to show you some guidelines for using CustomElements so that you have the best
possible experience developing and maintaining components built with `biotope-element`.

## Emitting
To prevent event cluttering on the window element you should only dispatch events on the component
itself or on its children. Anything outside is not under your control and should be handled with
care.

To dispatch an event you can just call the `this.emit` function on your component:

```javascript
import Component from '@biotope/element';

class MyButton extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return this.html`
      <button onclick=${this.handleClick}>
        <slot />
      </button>
    `;
  }

  handleClick(event) {
    // Emitting the event
    this.emit('pressed');
  }
}

MyButton.componentName = 'my-button';
MyButton.register();
```

This will dispatch an event with the name "pressed" that any parent element can listen to.

__Note 📝:__ You can always ignore the `this.emit` function and just call an event dispatcher
yourself with a `new CustomEvent`. It's up to you.

__Important__ ⚠️: Event names should always be written in lowercase - camelCase is not supported.

### Sending a value
In the previous example, nothing else gets passed trough to the parent, just the event. But there
are some cases where you may need to pass some additional information about the event, like a value.

You can simply do it by sending a second argument to the `emit` function, like so:

```javascript
// handleClick function
this.emit('pressed', 'Super secret value');
```

Now the parent can read that value and get more info about the event.

### Scoping the event
The third argument of the `emit` function is a boolean that can scope the event being sent by
appending the component name to the event name.

The code below will send an event named "my-button-pressed" instead of just pressed. This can be
useful in situations where you are sure to have a lot of similar event being fired by different
components.

```javascript
// handleClick function
this.emit('pressed', 'Super secret value', true);
```

## Listening
To listen to these custom events, you can just pass a function to an attribute with the same
name as your event. The function you pass should bind `this` so we can access the component inside.

If we take the simple "my-button" component as a child component of this next one:

```javascript
import Component from '@biotope/element';
import { MyButton } from './my-button';

class MyForm extends Component {
  constructor() {
    super();
    this.handlePress = this.handlePress.bind(this);
  }

  render() {
    return this.html`
      …
      <my-button onpressed=${this.handlePress}>CLick me!</button>
    `;
  }

  handlePress(event) {
    // Do somthing with that "pressed" event
  }
}

MyForm.componentName = 'my-form';
MyForm.dependencies = [
  MyButton,
];
MyForm.register();
```

Then we can see how the event is received by the parent.

If the event contains some more information, be it a string or a more complex object, then you can
get it by accessing the `event.detail` property.

```javascript
// the handlePress event listener
handlePress({ detail }) {
  // Now you have the detail that was sent by the child
}
```

## Naming
To prevent typos in your events, and because magic number and magic strings aren't god practice
altogether, we advise you to keep your event names in an object that can potentially be exported.

```javascript
export const MY_BUTTON_EVENTS = {
  PRESSED: 'pressed',
};
```

This will also allow parent elements not to have typos when listening to the events themselves.

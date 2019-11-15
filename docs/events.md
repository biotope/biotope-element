---
id: events
title: Events
---

Events in HTML are used for communication between your components and the outside world. `biotope-element`
uses the native CustomEvent implementation, so only pure JavaScript is used.

Below you'll also find some guidelines for using CustomElements so that you have the best possible
experience developing and maintaining components built with `biotope-element`.

## Emitting
To prevent event cluttering on the window element you should only dispatch events on the component
itself or on its children. Anything outside is not under your control and should be handled with
care.

To dispatch an event you can just call the `emit` function on your component:

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

> __📝 Note:__ You can always ignore the `emit` function and just call an event dispatcher yourself
with a `new CustomEvent`. It's up to you.

> __⚠️ Important:__ Event names should always be written in lowercase - capital letters are not
supported.

### Sending a value
In the previous example, nothing else gets passed through to the parent, just the event. But there
are some cases where you may need to pass some additional information about the event, like a value.

You can simply do it by sending a second argument to the `emit` function, like so:

```javascript
this.emit('pressed', 'Super secret value');
```

Now the parent can read that value and get more info about the event.

### Bubbling the event
By default, when using the `emit` function, any emitted event will be bubbled. With the third
argument of the `emit` function, we can tell the event to disable event bubbling. This means that if
a truthy value is passed as a third argument, any parent component will not receive the event.

Consider that the `my-button` component sends a `pressed` event with bubbling disabled.

```html
<div>
  <my-form>
    <my-button></my-button>
  </my-form>
</div>

<script>
  const createListener = (name) => () => console.log(name);

  document.querySelector('my-button').addEventListener('pressed', createListener('my-button'));
  document.querySelector('my-form').addEventListener('pressed', createListener('my-form'));
  document.querySelector('div').addEventListener('pressed', createListener('div'));
</script>
```

In the above scenario, only `my-button` will be printed to the console.

## Listening
To listen to these custom events, you can just pass a function to an attribute with the same name as
your event. The function you pass should bind `this` so we can access the component inside.

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
    // Do something related to that "pressed" event
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
handlePress({ detail }) {
  // Now you have the detail that was sent by the child (i.e. the "Super secret value")
}
```

## Naming
To prevent typos in your events, and because magic number and magic strings aren't good practice
altogether, we advise you to keep your event names in an object that can potentially be exported.

```javascript
export const MY_BUTTON_EVENTS = {
  PRESSED: 'pressed',
};
```

This will also make sure parent elements don't introduce typos when registering the event listeners.

# Events
Events are for communication of your 
components to the outside world.
There is nothing different from normal 
javascript events here. We just have some 
guidelines which may help you using 
biotope-element with events.

## Definition
To prevent typos in your events, we encourage you to define you events as constants and always reference it instead of just using a string:
```js
const MY_BUTTON_EVENTS = {
    PRESSED: 'pressed'
}

export default MY_BUTTON_EVENTS;
```

!> __Important ⚠️: Camelcase will not work with callbacks on elements.__

## Emit
To prevent event cluttering on the window element you should only dispatch events on the component itself or on its children. Anything outside is not under your control and should be handled with care.

To dispatch an event you can just call `emit` on the component:

```js
import Component from '@biotope/element';
import MY_BUTTON_EVENTS from './events';

class MyButton extends Component {
    constructor() {
        super();
        // we have to bind the callback to accesss this inside the function
        this.onclick = this.onclick.bind(this)
    }
    render() {
        return this.html`
            <button onclick=${this.onclick}>
                <slot/>
            </button>
        `;
    }

    onclick(event) {
        this.emit(MY_BUTTON_EVENTS.PRESSED)
    }
}

MyButton.componentName = 'my-button';

MyButton.register();
```

## Listen
Now to listen to these custom events, you can just pass a function to an attribute with the same name as your event. The function you pass should bind `this` so we can access the component inside:

```js
import Component from '@biotope/element';
import MY_BUTTON_EVENTS from '../MyButton/events';

class ImageStage extends Component {
    render() {
        return this.html`
            <img src="some/fancy/img.jpg"> 
            <my-button onpressed=${this.onButtonPress.bind(this)}>CLick me!</button>
        `;
    }

    onButtonPress(event) {
        // Execute code here
    }
}

ImageStage.componentName = 'image-stage';

ImageStage.register();
```

This will call the `onButtonPress` function on the `ImageStage`, as soon as the `my-button` component fires the `pressed` event.

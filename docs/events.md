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
> Important ⚠️: Camelcase will be ignored in event names.

## Dispatch
To prevent event cluttering on the window element you should only dispatch events on the component itself or on its children. Anything outside is not under your control and should be handled with care.

To dispatch an event you can just call `dispatch` on the component:

```js
import Component from '@biotope/element';
import MY_BUTTON_EVENTS from '@biotope/element';

class MyButton extends Component {
    render() {
        return this.html`
            <button onclick=${this.onclick}>
                <slot/>
            </button>
        `;
    }

    onclick(event) {
        this.dispatch(new CustomEvent(MY_BUTTON_EVENTS.PRESSED))
    }
}

MyButton.componentName = 'my-button';

MyButton.register();
```

## Listen
Now to listen to these custom events, you can just pass a function to a attribute with the same name as your event. The function you pass should bind `this` so we can access the component inside:

```js
import Component from '@biotope/element';

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

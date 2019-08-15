# Advanced

## Partials and Loops
It is generally a good idea to split your render function into multiple pieces otherwise it may end
up too messy. You can do this with both `this.html` and `this.partial` functions. The first one
take care of outputing your html to the DOM and the second one is used for the oh-so-sweet render
splitting. Here is an example of partials being built on a loop.

```javascript
import Component from '@biotope/element';

class MyText extends Component {
  render() {
    const myArrayFromANumber = (new Array(4)).fill(0);

    return this.html`
      <div># Here are ${randomNumber} divs on a loop</div>
      ${myArrayFromANumber.map((_, index) => this.partial`
        <div>Hey! I'm div number ${index + 1}</div>
      `)}
      <div># All done!</div>
    `;
  }
}

MyText.componentName = 'my-text';
MyText.register();
```

The result would be:

```html
<my-text>
  <div># Here are 4 divs on a loop</div>
  <div>Hey! I'm div number 1</div>
  <div>Hey! I'm div number 2</div>
  <div>Hey! I'm div number 3</div>
  <div>Hey! I'm div number 4</div>
  <div># All done!</div>
</my-text>
```

## Handling state
Every component can have its own internal state. To set the state just call the `setState` function
of the component with either the part of the state you with to update or a function (note: the
passed function will receive the current state as a parameter and must return the new one).
You can define `defaultState` as your initial state in the constructor. Note that `setState` will
trigger a new render.

If you're using typescript (or @babel/plugin-proposal-class-properties for example), you can also
declare `defaultState` as a property of your class - you can see an example of this commented below.

```javascript
import Component from '@biotope/element';

class MyButton extends Component {
  // NOTE: for typescript, @babel/plugin-proposal-class-properties or something similar
  // defaultState = {
  //   powermode: 'off',
  // }

  constructor() {
    super();

    // for simple non-fancy js users
    this.defaultState = {
      powermode: 'off',
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.onclick);
  }

  onclick() {
    // this will set the state on click
    this.setState({
      powermode: 'on',
    });
  }

  render() {
    return this.html`
      Powermode ${this.state.powermode}!
    `;
  }
}

MyButton.componentName = 'my-button';
MyButton.register();
```

```html
<my-button></my-button>
```

Result:
```html
<my-button>
  bar
</my-button>
```

In typescript, it would look like this:

```javascript
// typescript
import Component from '@biotope/element';

interface MyButtonState {
  powermode: 'on' | 'off';
}

class MyButton extends Component<object, MyButtonState> {
  public static componentName = 'my-button';

  protected defaultState: MyButtonState = {
    powermode: 'off',
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this.onclick);
  }

  public onclick(): void {
    // this will set the state on click
    this.setState({
      powermode: 'on',
    });
  }

  public render(): ShadowRoot | HTMLElement {
    return this.html`
      Powermode ${this.state.powermode}!
    `;
  }
}

MyButton.register();
```

## Dependencies
Your component may need some other components to work. To allow the components to be registered when
you need them, you can define dependencies for every component:

```javascript
// typescript
import Component from '@biotope/element';

class XSlide extends Component {
  public static componentName = 'x-slide';

  public render(): HTMLElement {
    return this.html``;
  }
}

class XSlider extends Component {
  public static componentName = 'x-slider';

  public static dependencies = [
    // Here the slider needs the slides to display correctly
    XSlide as typeof Component,
  ];

  public render(): ShadowRoot | HTMLElement {
    return this.html`
      <x-slide></x-slide>
    `;
  }
}

// This will also register the XSlide component if not already registered
XSlider.register();
```

## Nesting components
You can also nest components inside the html and use the `children` accessor to get them in the root
component and manipulate them.

```javascript
// typescript
import Component from '@biotope/element';

class XSlide extends Component {
  public static componentName = 'x-slide';

  public render(): ShadowRoot | HTMLElement {
    return this.html``;
  }
}

class XSlider extends Component {
  public static componentName = 'x-slider';

  public static dependencies = [
    XSlide as typeof Component,
  ];

  public render(): ShadowRoot | HTMLElement {
    // Here we use this.children to access the three child x-slides
    return this.html`
      ${this.children.map(child => 'Slide')}
    `;
  }
}

XSlider.register();
```

```html
<x-slider>
  Slide
  Slide
  Slide
</x-slider>
```

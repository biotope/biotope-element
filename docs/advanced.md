# Advanced

## Handling state
Every component can have its own internal state. To set the state just call the `setState` function
of the component. You can define `defaultState` as your initial state or you can set `this.state`
in the constructor.
Note that only `setState` will trigger a new render.

```javascript
import Component from '@biotope/element';

class MyButton extends Component {
  constructor() {
    super();

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

interface MyButtonProps {
  powermode: 'on' | 'off';
}

class MyButton extends Component<MyButtonProps> {
  public static componentName = 'my-button';

  protected defaultState: MyButtonProps = {
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

  public render(): void {
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

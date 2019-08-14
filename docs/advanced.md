# Advanced

## Handling state
Every component can have its own internal state. To set the state just call the `setState` function of the component. To use the state just use `this.state`.
```js
import Component from '@biotope/element';


class MyButton extends Component {
  get defaultState() {
    return {
      powermode: 'off'
    }
  }
  connectedCallback() {
    this.addEventListener('click', this.onclick);
  }
  onclick() {
    // this will set the state on click
    this.setState({
      powermode: "on"
    });
  }

  render() {
    return this.html`
      Powermode ${this.state.powermode}
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



## Dependencies
Your component may need some other components to work. To allow the components to be registered when you need them, you can define dependencies for every component:

```typescript
// typescript
import Component from '@biotope/element';

class XSlide extends Component {
  static componentName = 'x-slide';

  render() {
    return this.html``;
  }
}

class XSlider extends Component {
  // Here the slider needs the slides to display correctly
  static dependencies = [XSlide as typeof Component];

  static componentName = 'x-slider';

  render() {
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


```typescript
// typescript
import Component from '@biotope/element';

class XSlide extends Component {
  static componentName = 'x-slide';

  render() {
    return this.html``;
  }
}

class XSlider extends Component {
  static dependencies = [XSlide as typeof Component];

  static componentName = 'x-slider';

  render() {
    // Here we use this.children to access the three child x-slides
    const slides = this.children.map(el => 'Slide');
    return this.html`
      ${slides}
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

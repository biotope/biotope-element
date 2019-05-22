# Biotope Element

[![Build Status](https://travis-ci.org/biotope/biotope-element.svg?branch=master)](https://travis-ci.org/biotope/biotope-element)
[![codecov](https://codecov.io/gh/biotope/biotope-element/branch/master/graph/badge.svg)](https://codecov.io/gh/biotope/biotope-element)

## Installation
You can install the biotope element in your project using npm
```bash
npm install @biotope/element --save
```
or yarn
```bash
yarn add @biotope/element --save
```
<br/>
After that to use it, import it in your project:

```js
import Component from '@biotope/element';
```

## Usage

To use the biotope element, you have to extend it with your custom class:

```js
import Component from '@biotope/element';

export class MyButton extends Component {
  public static componentName = 'my-button';

  public render() {
    return this.html`Hello World 🐤`;
  }
}
```

After defining your class which you can do using existing methods (link) you have to call `register` on the class itself to use it in the html:
index.js
```js
import Component from '@biotope/element';

export class MyButton extends Component {
  public static componentName = 'my-button';

  public render() {
    return this.html`Hello World 🐤`;
  }
}

MyButton.register();
```

After that you can use it in your html like that:
index.html
```html
<script src="index.js"></script>
<my-button></my-button>
```

This will result inthe following html:
```html
<my-button>
  Hello world 🐤
</my-button>
```

## Polyfills
### Array.prototype.find
As we want to keep biotope element slim. We are not shipping polyfills for legacy browsers.
Biotope element leverages the `Array.prototype.find` function. Which is not supported by older browsers.
To use biotope element there, please take care of loading an appropriate polyfill

### Webcomponents
Webcomponents are not supported by all browsers. Even the newest browsers have not integrated the spec yet.
To still be able to use biotope element in your project in all major browsers, please include the [webcomponent polyfills](https://github.com/webcomponents/webcomponentsjs) in your project.


## Documentation
You can find the documentation [here](https://element.biotope.sh).

In order to contribute to the documentation you can start a local server with `npm start` and then start editing the files in `docs`.

# Biotope Element

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
    return this.html`Hello World`;
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

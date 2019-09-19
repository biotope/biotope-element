---
id: index
title: Quick Start
---

## Installation
You can install the biotope element in your project using npm

```bash
npm install @biotope/element --save
```

or yarn

```bash
yarn add @biotope/element
```

## Create your first component
First import the element in your component:

```javascript
import Component from '@biotope/element';
```

Then you extend your component with the biotope element:

```javascript
class HelloWorldComponent extends Component {
  render() {
    return this.html`
      Hello World 🐤
    `;
  }
}

// needed if you transpile to es5 and uglify your code at the same time
HelloWorldComponent.componentName = 'hello-world';
```

```javascript
// typescript
class HelloWorldComponent extends Component {
  // needed if you transpile to es5 and uglify your code at the same time
  public static componentName = 'hello-world';

  public render(): HTMLElement {
    return this.html`
      Hello World 🐤
    `;
  }
}
```

> Notice the `static componentName` part. This has to be set AND it should be written in kebab-case.

After defining the class, you have to call the `register` function on it, to use it in HTML:

```javascript
HelloWorldComponent.register();
```

So the whole file will look like this:
```javascript
import Component from '@biotope/element';

class HelloWorldComponent extends Component {
  render() {
    return this.html`
      Hello World 🐤
    `;
  }
}

HelloWorldComponent.componentName = 'hello-world';
HelloWorldComponent.register();
```

After that you can use it in your html like that:

```html
<my-button></my-button>
```

This will result in the following html:

```html
<my-button>
  Hello world 🐤
</my-button>
```

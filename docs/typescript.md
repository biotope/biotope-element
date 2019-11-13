---
id: typescript
title: Typescript
---

We ❤️ Typescript.

So much so that the entirety of the `biotope-element` codebase is built using typescript only.

Given that fact, every example you see in this documentation is easily portable to Typescript as we
export all the types that you might need to develop your codebase without using wildcard types.
Additionally, we have also established clear and predictable member-access for all properties and
functions `biotope-element` provides.

Here are two examples of components that incorporate most of what you can see in these docs, so that
you don't need to scour them to look for that little piece of the puzzle that `tsc` is complaining
about.

This first example is a child component (to be used by the parent component):

```typescript
// my-button.ts
import Component, { HTMLFragment, PropValue } from '@biotope/element';

export type MuButtonEventPressed = string;

export interface MyButtonProps {
  text: string;
}

interface MyButtonState {
  counter: number;
}

export class MyButton extends Component<MyButtonProps, MyButtonState> {
  public static componentName = 'my-button';

  public static attributes = [
    'text',
  ];

  protected readonly defaultProps: MyButtonProps = {
    text: '';
  };

  protected readonly defaultState: MyButtonState = {
    counter: 0;
  };

  public connectedCallback(): void {
    // do some init here
  }

  public disconnectedCallback(): void {
    // do some cleanup here
  }

  public attributeChangedCallback(name: string, previous: PropValue, current: PropValue): void {
    super.attributeChangedCallback(name, previous, current);
    // update state given a set of new props
  }

  public render(): HTMLFragment {
    return this.html`
      …
    `;
  }

  public rendered(): void {
    // do some event listener attaching here
  }

  private handleClick(): void {
    this.emit<MuButtonEventPressed>('pressed', 'Some secret value');
  }
}

MyButton.register();
```

This is the parent component:

```typescript
// my-form.ts
import Component, { createRef, HTMLFragment } from '@biotope/element';
import { MyButton, MuButtonEventPressed } from './my-button';

export class MyForm extends Component {
  public static componentName = 'my-form';

  public static dependencies = [
    MyButton as typeof Component,
  ];

  private refs = {
    myButton: createRef<MyButton>(),
    input: createRefCallback<HTMLInputElement>(
      () => this.shadowRoot.querySelector('my-fancy-class'),
    ),
  };

  public constructor() {
    super();
    this.handlePress = this.handlePress.bind(this);
  }

  public render(): HTMLFragment {
    return this.html`
      <input class="my-fancy-class" />
      <my-button ref=${this.refs.myButton} onpressed=${this.handlePress}></my-button>
    `;
  }

  private handlePress({ detail }: CustomEvent<MuButtonEventPressed>): void {
    // do something with the string "detail"
  }
}

MyForm.register();
```

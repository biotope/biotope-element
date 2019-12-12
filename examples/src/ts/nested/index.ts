import Component, { HTMLFragment } from '@biotope/element';
import { ExampleChild } from './child';

interface ExampleParentProps {
  text?: string;
}

export class ExampleParent extends Component<ExampleParentProps> {
  public static componentName = 'example-parent';

  public static attributes = ['text'];

  public static dependencies = [
    ExampleChild as typeof Component,
  ];

  public get text() {
    return 'Another text';
  }

  public constructor() {
    super(false);
  }

  public render(): HTMLFragment {
    return this.html`
      <div>
        <example-child
          text=${this.props.text}
          another-text="Hello World"
        />
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  public rendered(): void {
    // eslint-disable-next-line no-console
    console.log('PARENT: elements are in the DOM');
  }
}

ExampleParent.register();

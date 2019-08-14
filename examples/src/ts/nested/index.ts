import Component from '@biotope/element';
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

  public render(): ShadowRoot | HTMLElement {
    return this.html`
      <div>
        <example-child
          text=${this.props.text}
          another-text="Hello World"
        />
      </div>
    `;
  }
}

ExampleParent.register();

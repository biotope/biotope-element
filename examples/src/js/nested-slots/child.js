import Component from '@biotope/element';

export class ExampleChild extends Component {
  render() {
    return this.html`
      <style>
        :host {
          color: orange;
        }

        ::slotted(*) {
          color: blue;
        }
      </style>
      <slot />
      <p>I am not slotted.</p>
    `;
  }
}

ExampleChild.componentName = 'example-child';

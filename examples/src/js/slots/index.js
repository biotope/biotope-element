import Component from '@biotope/element';

export class ExampleSlots extends Component {
  render() {
    return this.html`
      <p>I'm the TOP text of the component.</p>
      <slot />
      <p>I'm the BOTTOM text of the component.</p>
    `;
  }
}

ExampleSlots.componentName = 'example-slots';
ExampleSlots.register();

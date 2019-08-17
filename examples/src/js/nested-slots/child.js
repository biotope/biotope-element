import Component from '@biotope/element';

export class ExampleChild extends Component {
  render() {
    return this.html`
      <style>
        .slotted {
          color: blue;
        }

        /* does not work on IE/Edge */
        ::slotted(*) {
          color: blue;
        }
      </style>
      <div class="slotted">
        <slot />
      </div>
      <p>I am not slotted.</p>
    `;
  }
}

ExampleChild.componentName = 'example-child';

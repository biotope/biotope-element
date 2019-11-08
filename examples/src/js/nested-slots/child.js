import Component from '@biotope/element';

export class ExampleChild extends Component {
  render() {
    return this.html`
      <div class="slotted">
        <slot />
      </div>
      <p>I am not slotted.</p>
      <style>
        .slotted {
          color: blue;
        }

        /* does not work on IE/Edge */
        ::slotted(*) {
          color: blue;
        }
      </style>
    `;
  }
}

ExampleChild.componentName = 'example-child';

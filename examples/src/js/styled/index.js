import Component from '@biotope/element';

class ExampleButton extends Component {
  render() {
    return this.html`
      <button>Normal Button</button>
      <style>
        :host {
          --base-font-size: 24px;
        }

        :host button {
          font-size: var(--base-font-size);
          background: transparent;
          border-radius: 3px;
          border: 2px dotted blue;
          color: blue;
          margin: 0 1em;
          padding: 0.25em 1em;
          outline: none;
          position: relative;
        }

        :host button:hover,
        :host button:active,
        :host button:focus {
          border-style: solid;
          top: 1px;
          left: 1px;
        }

        /* *************************************
         * This needs to be repeated on
         * polyfilled browsers. You can use our
         * "host" mixin to help you or you can
         * create your own. Check it out here:
         * ./lib/host.mixin.scss
         * ************************************* */
        example-button {
          --base-font-size: 24px;
        }

        example-button button {
          font-size: var(--base-font-size);
          background: transparent;
          border-radius: 3px;
          border: 2px dotted blue;
          color: blue;
          margin: 0 1em;
          padding: 0.25em 1em;
          outline: none;
          position: relative;
        }

        example-button button:hover,
        example-button button:active,
        example-button button:focus {
          border-style: solid;
          top: 1px;
          left: 1px;
        }
        /* ************************************* */
      </style>
    `;
  }
}

ExampleButton.componentName = 'example-button';
ExampleButton.register();

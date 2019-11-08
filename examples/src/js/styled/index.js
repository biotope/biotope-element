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
          border: 2px solid blue;
          color: blue;
          margin: 0 1em;
          padding: 0.25em 1em;
          outline: none;
          position: relative;
        }

        :host button:focus {
          border-style: dotted;
        }

        :host button:active {
          top: 1px;
          left: 1px;
        }

        :host button:hover {
          border-style: solid;
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
          border: 2px solid blue;
          color: blue;
          margin: 0 1em;
          padding: 0.25em 1em;
          outline: none;
          position: relative;
        }

        example-button button:focus {
          border-style: dotted;
        }

        example-button button:active {
          top: 1px;
          left: 1px;
        }

        example-button button:hover {
          border-style: solid;
        }
        /* ************************************* */
      </style>
    `;
  }
}

ExampleButton.componentName = 'example-button';
ExampleButton.register();

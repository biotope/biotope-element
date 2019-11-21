import Component, { HTMLFragment } from '@biotope/element';

class ExampleButton extends Component {
  public static componentName = 'example-button';

  public render(): HTMLFragment {
    return this.html`
      <button>Normal Button</button>
      <style>
        :host {
          --base-font-size: 24px;
          --base-color: blue;
        }

        :host button {
          position: relative;
          margin: 0 1em;
          border: 2px dotted var(--base-color);
          border-radius: 3px;
          padding: .25em 1em;
          background: transparent;
          color: var(--base-color);
          font-size: var(--base-font-size);
          outline: none;
        }

        :host button:hover,
        :host button:active,
        :host button:focus {
          top: 1px;
          left: 1px;
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
          --base-color: blue;
        }

        example-button button {
          position: relative;
          margin: 0 1em;
          border: 2px dotted var(--base-color);
          border-radius: 3px;
          padding: .25em 1em;
          background: transparent;
          color: var(--base-color);
          font-size: var(--base-font-size);
          outline: none;
        }

        example-button button:hover,
        example-button button:active,
        example-button button:focus {
          top: 1px;
          left: 1px;
          border-style: solid;
        }
        /* ************************************* */
      </style>
    `;
  }
}

ExampleButton.register();

import Component from '@biotope/element';

class MyButton extends Component {
  constructor() {
    super();
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  render() {
    this.html`
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
    </style>
    <button onclick="${this.onButtonClick}">Normal Button</button>
    `
  }

  onButtonClick(event) {
    console.log('Button click event on: ', event.target);
    this.emit('click', {}, false);
  }
}

MyButton.componentName = 'my-button';

MyButton.register();

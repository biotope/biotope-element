import Component from '@biotope/element';

/* eslint-disable class-methods-use-this,no-alert */
export class BaseButton extends Component {
  greet(value) {
    alert(value);
  }

  render() {
    return this.html`
      <button>Normal Button</button>
    `;
  }
}
/* eslint-enable class-methods-use-this,no-alert */

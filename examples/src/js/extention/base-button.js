import Component from '@biotope/element';

export class BaseButton extends Component {
  /* eslint-disable class-methods-use-this,no-alert */
  greet(value) {
    alert(value);
  }
  /* eslint-enable class-methods-use-this,no-alert */

  render() {
    return this.html`
      <button>Normal Button</button>
    `;
  }
}

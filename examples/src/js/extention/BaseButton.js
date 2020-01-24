import Component from '@biotope/element';

export default class BaseButton extends Component {
  greet(value) {
    alert(value);
  }
  render() {
    return this.html`
      <button>Normal Button</button>
    `;
  }
}

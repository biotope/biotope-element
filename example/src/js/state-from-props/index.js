import Component from '@biotope/element';

function debounce(callback, wait, context = this) {
  let timeout = null
  let callbackArgs = null

  const later = () => callback.apply(context, callbackArgs)

  return function () {
    callbackArgs = arguments
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

class XC extends Component {
  constructor() {
    super();
    this.state = {
      text: ''
    }
  }

  onPropsChanged() {
    this.setState({ text: this.props.text });
  }
  get defaultProps() {
    return {
      text: ''
    }
  }
  connectedCallback() {
    window.onresize = debounce(this.handleResize, 500, this);
    this.updateText();
  }
  handleResize() {
    this.updateText();
  }
  updateText() {
    if (window.innerWidth < 1000) {
      let { text } = this.state;
      text = `i'm small`
      this.setState({ ...this.state, text });
    } else {
      this.setState({ ...this.state, text: this.props.text })
    }
  }
  render() {
    this.html`
      <h1>${this.state.text}</h1>
    `;
  }
}

XC.attributes = [
  'text'
];

XC.componentName = 'x-component';

XC.register();

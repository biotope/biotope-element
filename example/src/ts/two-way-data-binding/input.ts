import Component from '@biotope/element';

interface InputProps {
  text: string;
}

export class InputComp extends Component<InputProps, any> {
  static componentName = 'x-input';

  constructor() {
    super();
    this.onchange = this.onchange.bind(this);
  }

  static attributes = [
    'text'
  ]

  onchange(event: Event) {
    this.emit('change', (event.target as HTMLInputElement).value)
  }

  render() {
    this.html`
      <input value="${this.props.text}" onkeyup=${this.onchange}/>
    `;
  }
}

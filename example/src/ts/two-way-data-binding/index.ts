import { InputComp } from './input';
import Component from '@biotope/element';

interface CollectorState {
  text: string;
}

class Collector extends Component<any, CollectorState> {
  static componentName = 'x-collector';

  constructor() {
    super();
    this.onTextChange = this.onTextChange.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  static dependencies = [
    InputComp as any
  ]

  onClear(event: Event) {
    this.setState({
      text: ''
    })
  }

  onTextChange(event: CustomEvent) {
    this.setState({
      text: event.detail
    });
  }

  render() {
    this.html`
      <style>
        :host {
          position: relative;
        }
      
        .clear {
          color: red;
          position: absolute;
          right: 0;
          cursor: pointer;
        }
      </style>
      <h1>Two way data binding example</h1>
      <div>
        Your current input:
        <i>${this.state.text}</i>
      </div>
      <div onclick=${this.onClear} class="clear">X</div>
      <x-input text=${this.state.text} onchange=${this.onTextChange}>
    `;
  }
}

Collector.register();

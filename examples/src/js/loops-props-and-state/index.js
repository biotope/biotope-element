import Component from '@biotope/element';

const kebabToCamel = str => str.replace(
  /([-_][a-z])/g,
  group => group.toUpperCase().replace('-', ''),
);

export class ExampleTable extends Component {
  constructor() {
    super();
    this.getRow = this.getRow.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.defaultProps = {
      showCounter: false,
    };

    this.defaultState = {
      counter: 0,
    };
  }

  render() {
    const { showCounter } = this.props;
    const { counter } = this.state;

    return this.html`
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Typeof</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          ${ExampleTable.attributes.map(this.getRow)}
        </tbody>
      </table>
      ${showCounter ? this.partial`
        <button onclick=${this.handleClick}>Increment Counter</button>
        <span>${counter}</span>
      ` : null}
    `;
  }

  getRow(attribute) {
    const name = typeof attribute === 'string' ? attribute : attribute.name;

    return this.partial`
      <tr>
        <td>${name}</td>
        <td>${typeof this.props[kebabToCamel(name)]}</td>
        <td>${JSON.stringify(this.props[kebabToCamel(name)])}</td>
      </tr>
    `;
  }

  handleClick() {
    this.setState({
      counter: this.state.counter + 1,
    });
  }
}

ExampleTable.componentName = 'example-table';
ExampleTable.attributes = [
  'simple-text',
  {
    name: 'complex-attribute',
    type: 'array',
  },
  {
    name: 'converted-attribute',
    converter(prop) {
      if (prop === 'one') {
        return 1;
      }
      return prop === 'two' ? 2 : 0;
    },
  },
  {
    name: 'show-counter',
    type: 'boolean',
  },
];
ExampleTable.register();

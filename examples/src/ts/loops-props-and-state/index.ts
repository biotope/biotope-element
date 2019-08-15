import Component, { Attribute } from '@biotope/element';

const kebabToCamel = (str: string): string => str.replace(
  /([-_][a-z])/g,
  (group): string => group.toUpperCase().replace('-', ''),
);

export interface ExampleTableProps {
  showCounter: boolean;
  simpleText?: string;
  complexAttribute?: string[];
  convertedAttribute?: number;
}

interface ExampleTableState {
  counter: number;
}

export class ExampleTable extends Component<ExampleTableProps, ExampleTableState> {
  public static componentName = 'example-table';

  public static attributes = [
    'simple-text',
    {
      name: 'complex-attribute',
      type: 'array',
    },
    {
      name: 'converted-attribute',
      converter(prop?: string): number {
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

  // eslint-disable-next-line class-methods-use-this
  public get defaultProps(): ExampleTableProps {
    return {
      showCounter: false,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  public get defaultState(): ExampleTableState {
    return {
      counter: 0,
    };
  }

  public constructor() {
    super();
    this.getRow = this.getRow.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  public render(): HTMLElement {
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
        <button onclick=${this.onClick}>Increment Counter</button>
        <span>${counter}</span>
      ` : null}
    `;
  }

  private getRow(attribute: string | Attribute): HTMLElement {
    const name = typeof attribute === 'string' ? attribute : attribute.name;

    return this.partial`
      <tr>
        <td>${name}</td>
        <td>${typeof this.props[kebabToCamel(name)]}</td>
        <td>${JSON.stringify(this.props[kebabToCamel(name)])}</td>
      </tr>
    `;
  }

  private onClick(): void {
    this.setState({
      counter: this.state.counter + 1,
    });
  }
}

ExampleTable.register();

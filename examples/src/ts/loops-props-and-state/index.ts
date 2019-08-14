import Component, { Attribute } from '@biotope/element';

const kebabToCamel = (str: string): string => str.replace(
  /([-_][a-z])/g,
  (group): string => group.toUpperCase().replace('-', ''),
);

export interface ExampleTableProps {
  showCounter: boolean;
  simpleText?: string;
  complexAttribute?: string[];
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
      converter(prop?: string): string[] {
        try {
          return JSON.parse(prop || '');
        } catch (_) {
          return [];
        }
      },
    },
    {
      name: 'show-counter',
      converter: (prop?: string): boolean => !!prop || typeof prop === 'string',
    },
  ];

  protected defaultProps: ExampleTableProps = {
    showCounter: false,
  };

  protected defaultState: ExampleTableState = {
    counter: 0,
  };

  public constructor() {
    super();
    this.getRow = this.getRow.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  public render(): ShadowRoot | HTMLElement {
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

  private handleClick(): void {
    this.setState({
      counter: this.state.counter + 1,
    });
  }
}

ExampleTable.register();

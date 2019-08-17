import Component from '../src/index';
import { createPartial } from '../src/create-html';

jest.mock('../src/create-html', (): object => {
  const constantPartial = jest.fn();
  return {
    createRender: jest.fn((context, func): typeof func => func.bind(context)),
    createPartial: (): jest.Mock => constantPartial,
  };
});

describe('loops', (): void => {
  const calls = 5;

  it('works with array maps', (): void => {
    class TestElement extends Component {
      public static componentName = 'test-element';

      public render(): HTMLElement {
        return this.html`
          ${(new Array(calls)).fill(0).map((): HTMLElement => this.html`Hello World!`)}
        `;
      }
    }
    const element = new TestElement();
    element.connectedCallback();

    expect((createPartial() as jest.Mock).mock.calls).toHaveLength(calls + 1);
  });
});

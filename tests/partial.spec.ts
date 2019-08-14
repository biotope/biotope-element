import Component from '../src/index';
import { createPartial } from '../src/create-html';

jest.mock('../src/create-html', (): object => ({
  createHtml: jest.fn((): string => 'html'),
  createPartial: jest.fn((): string => 'partial'),
}));

describe('#partial', (): void => {
  beforeEach((): void => {
    (createPartial as jest.Mock).mockClear();
  });

  it('calls the partial function', (): void => {
    class TestElement extends Component {
      public static componentName = 'test-element';
    }
    const element = new TestElement();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((element as any).partial).toBe('partial');
  });

  it('does not redefine partial', (): void => {
    class TestElement extends Component {
      public static componentName = 'test-element-2';

      public render(): any {
        return this.partial;
      }
    }
    const element = new TestElement();
    element.connectedCallback();
    element.render();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((createPartial as jest.Mock).mock.calls).toHaveLength(1);
  });
});

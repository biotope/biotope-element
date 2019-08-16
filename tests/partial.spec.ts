import Component from '../src/index';
import { createPartial } from '../src/create-html';

jest.mock('../src/create-html', (): object => ({
  createRender: jest.fn((context, func): typeof func => func.bind(context)),
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
    expect((element as any).html).toBe('partial');
  });
});

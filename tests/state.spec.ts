/* eslint-disable max-classes-per-file */
import Component from '../src';

describe('#state', (): void => {
  let element: Component;
  let mockRender;

  beforeEach((): void => {
    mockRender = jest.fn();

    interface TestElementState {
      mockAttributeOne: string;
      mockAttributeTwo: string;
    }
    class TestElement extends Component<object, TestElementState> {
      public static componentName = 'test-element';

      protected defaultState: TestElementState = {
        mockAttributeOne: '',
        mockAttributeTwo: '',
      }

      public render = mockRender;
    }
    element = new TestElement();
  });

  it('initially contains the default state', (): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((element as any).state).toEqual({
      mockAttributeOne: '',
      mockAttributeTwo: '',
    });
  });

  describe('setState is called with object', (): void => {
    beforeEach((): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (element as any).setState({
        mockAttributeOne: 'mock-value',
      });
    });

    it('triggers the render', (): void => {
      expect(mockRender.mock.calls).toHaveLength(1);
    });

    it('modifies the state', (): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((element as any).state).toEqual({
        mockAttributeOne: 'mock-value',
        mockAttributeTwo: '',
      });
    });
  });

  describe('setState is called with a function', (): void => {
    beforeEach((): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (element as any).setState((): object => ({
        mockAttributeOne: 'mock-value',
      }));
    });

    it('triggers the render', (): void => {
      expect(mockRender.mock.calls).toHaveLength(1);
    });

    it('modifies the state', (): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((element as any).state).toEqual({
        mockAttributeOne: 'mock-value',
        mockAttributeTwo: '',
      });
    });
  });

  describe('no default state given', (): void => {
    beforeEach((): void => {
      class TestElement extends Component {
        public static componentName = 'test-element';
      }
      element = new TestElement();
    });

    it('props is an empty object', (): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((element as any).state).toEqual({});
    });
  });
});
/* eslint-enable max-classes-per-file */

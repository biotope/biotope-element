/* eslint-disable max-classes-per-file */
import Component from '../src';

interface TestComponentProps {
  myFunctionAttribute: () => string;
}

describe('#getAttributeFunction', () => {
  let element: Component;

  describe('requesting a function type', () => {
    beforeEach(() => {
      class TestComponent extends Component<TestComponentProps> {
        protected readonly defaultProps = {
          myFunctionAttribute: (): string => 'original-attribute',
        };
      }
      element = new TestComponent();
    });

    it('gets the function attribute', () => {
      expect(element.getAttributeFunction('my-function-attribute')()).toBe('original-attribute');
    });
  });

  describe('requesting a non-function type', () => {
    beforeEach(() => {
      class TestComponent extends Component<{ myFunctionAttribute: string }> {
        protected readonly defaultProps = {
          myFunctionAttribute: 'original-attribute',
        };
      }
      element = new TestComponent();
    });

    it('gets the function attribute', () => {
      expect(element.getAttributeFunction('my-function-attribute')).toBe(null);
    });
  });
});

describe('#setAttributeFunction', () => {
  let element: Component;
  let mockACC: jest.Mock;
  let mockOriginal: jest.Mock;
  let mockFunction: jest.Mock;

  beforeEach(() => {
    mockACC = jest.fn();
    mockOriginal = jest.fn();
    mockFunction = jest.fn();

    class TestComponent extends Component<TestComponentProps> {
      protected readonly defaultProps = {
        myFunctionAttribute: mockOriginal,
      };

      public attributeChangedCallback = mockACC;
    }
    element = new TestComponent();
    element.setAttributeFunction('my-function-attribute', mockFunction);
  });

  it('triggers the attributeChangedCallback', () => {
    expect((element.attributeChangedCallback as jest.Mock).mock.calls).toHaveLength(1);
    expect((element.attributeChangedCallback as jest.Mock).mock.calls[0]).toEqual([
      'my-function-attribute', mockOriginal, mockFunction,
    ]);
  });
});

describe('#removeAttributeFunction', () => {
  let element: Component;
  let mockACC: jest.Mock;
  let mockOriginal: jest.Mock;

  beforeEach(() => {
    mockACC = jest.fn();
    mockOriginal = jest.fn();

    class TestComponent extends Component<TestComponentProps> {
      protected readonly defaultProps = {
        myFunctionAttribute: mockOriginal,
      };

      public attributeChangedCallback = mockACC;
    }
    element = new TestComponent();
    element.removeAttributeFunction('my-function-attribute');
  });

  it('triggers the attributeChangedCallback', () => {
    expect((element.attributeChangedCallback as jest.Mock).mock.calls).toHaveLength(1);
    expect((element.attributeChangedCallback as jest.Mock).mock.calls[0]).toEqual([
      'my-function-attribute', mockOriginal, null,
    ]);
  });
});
/* eslint-enable max-classes-per-file */

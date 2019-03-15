import Component from '../src/index';
import { register } from '../src/register';

describe('#register', () => {
  class TestComp extends Component<any, any> {
    static componentName = 'test-comp-tag'
  }

  beforeEach(() => {
    require('basichtml').init({
      window: global
    });
  });

  it('throws error for undefined component', () => {
    expect(() => register(undefined)).toThrowError(new Error('No component to register defined!'));
  });

  it('throws error if component already registered', () => {
    register(TestComp);
    expect(() => register(TestComp)).toThrowError(new Error('Component already registered!'));
  });

  it('registers component with no name', () => {
    class UnnamedTestComp extends Component<any, any> {

    }
    register(UnnamedTestComp);
    expect(window.customElements.get('unnamed-test-comp')).not.toBeNull();
  });

  it('registers component with name', () => {
    register(TestComp);
    expect(window.customElements.get('test-comp-tag')).not.toBeNull();
  });

  it('registers dependencies', () => {
    class DependatComp extends Component<any, any> {
      static dependencies = [
        TestComp
      ]
    }
    register(DependatComp);
    expect(window.customElements.get('test-comp-tag')).not.toBeNull();
  });
});

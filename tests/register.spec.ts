import Component from '../src/index';
import { register } from '../src/register';

describe('#register', (): void => {
  class TestComp extends Component {
    public static componentName = 'test-comp-tag';
  }

  beforeEach((): void => {
    // eslint-disable-next-line global-require
    require('basichtml').init({
      window: global,
    });
  });

  it('throws error for undefined component', (): void => {
    expect((): void => register(undefined)).toThrowError(new Error('No component to register defined!'));
  });

  it('warns if component already registered', (): void => {
    register(TestComp);
    window.console.warn = jest.fn();
    register(TestComp);
    expect(window.console.warn).toHaveBeenCalledWith('Attempt to re-register component "test-comp-tag". Skipping…');
  });

  it('registers component with no name', (): void => {
    class UnnamedTestComp extends Component {

    }
    register(UnnamedTestComp);
    expect(window.customElements.get('unnamed-test-comp')).not.toBeNull();
  });

  it('registers component with name', (): void => {
    register(TestComp);
    expect(window.customElements.get('test-comp-tag')).not.toBeNull();
  });

  it('registers dependencies', (): void => {
    class DependatComp extends Component {
      public static dependencies = [
        TestComp,
      ];
    }
    register(DependatComp);
    expect(window.customElements.get('test-comp-tag')).not.toBeNull();
  });
});

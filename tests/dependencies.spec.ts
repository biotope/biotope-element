import Component from '../src/index';

describe('dependencies', () => {
  it('registers dependencies on component register', () => {
    const registerSpy = jest.fn();

    class RegisterTest extends Component<object, object> {
      public static componentName = 'x-register'
      public static register = registerSpy;
    }

    class Test extends Component<object, object> {
      public static componentName = 'x-test';
      public static dependencies = [RegisterTest as typeof Component];
    }

    Test.register();

    expect(registerSpy.mock.calls.length).toBe(1);
  })
})

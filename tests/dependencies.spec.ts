import { expect } from 'chai';
import * as sinon from 'sinon';
import Component from '../src/index';

describe('dependencies', () => {
  it('registers dependencies on component register', () => {
    const registerSpy = sinon.spy();

    class RegisterTest extends Component<object, object> {
      public static componentName = 'x-register'
      public static register = registerSpy;
    }

    class Test extends Component<object, object> {
      public static componentName = 'x-test';
      public static dependencies = [RegisterTest as typeof Component];
    }

    Test.register();

    expect(registerSpy).to.have.been.calledOnce;
  })
})

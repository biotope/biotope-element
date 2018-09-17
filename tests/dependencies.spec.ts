import { expect } from 'chai';
import * as sinon from 'sinon';
import Component from '../src/index';

describe('dependencies', () => {
    it('registers dependencies on component register', () => {
        const registerSpy = sinon.spy();
        class RegisterTest extends Component<{}, {}> {
            static componentName = 'x-register'
            static register = registerSpy;
        }
        class Test extends Component<{}, {}> {
            static componentName = 'x-test';
            static dependencies = [RegisterTest]
        }

        Test.register();

        expect(registerSpy).to.have.been.calledOnce;
    })
})

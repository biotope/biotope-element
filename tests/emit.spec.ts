import Component from '../src/index';
describe('emit', () => {

  let element: Component<any, any>;
  beforeEach(() => {
    class TestElement extends Component<any, any> {
      static componentName = 'my-comp'
    }

    element = new TestElement();
  })

  it('Throws error for undefined event name', () => {
    expect(() => element['emit'](undefined)).toThrowError();
  });
});

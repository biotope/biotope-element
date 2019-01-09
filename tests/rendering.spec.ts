import Component from '../src/index';


describe('render', () => {

    it('is called on created', () => {
        const renderSpy = jest.fn();
        class HelloWorld extends Component<object, object> {
            public static componentName = 'x-world';

            public render = renderSpy;
        }

        const instance = new HelloWorld();
        instance.created();

        expect(renderSpy.mock.calls.length).toBe(1);
    });

    it('is called onPropsChanged by default', () => {
        const renderSpy = jest.fn();
        class HelloWorld extends Component<object, object> {
            public static componentName = 'x-world';

            public render = renderSpy;
        }

        const instance = new HelloWorld();
        (instance as any).onPropsChanged();

        expect(renderSpy.mock.calls.length).toBe(1);
    });
})


declare module 'basichtml' {
    interface Options {
        window?: Object,
        customElements?: typeof customElements,
        selector?: {
           name?: string;
           module?: () => any;
           $?: (module: any, element: HTMLElement, css: string) => any;
       }
    }

    class CustomElementRegistry {
        define: (name: string, constructor: Function, options: Options) => void;
    }

    const basicHTML: {
        init: (options: Options) => typeof Window,
        CustomElementRegistry: any;
    };
    export default basicHTML;
}
    
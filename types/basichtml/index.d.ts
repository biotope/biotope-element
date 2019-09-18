
declare module 'basichtml' {
  interface Options {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window?: Record<string, any>;
    customElements?: typeof customElements;
    selector?: {
      name?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      module?: () => any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      $?: (module: any, element: HTMLElement, css: string) => any;
    };
  }

  class CustomElementRegistry {
    public define: (name: string, constructor: Function, options: Options) => void;
  }

  const basicHTML: {
    init: (options: Options) => typeof Window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CustomElementRegistry: any;
  };
  // eslint-disable-next-line import/no-default-export
  export default basicHTML;
}

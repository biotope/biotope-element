
declare module 'basichtml-elements' {
  const basicHTMLElements: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defineOnRegistry: (customElements: any) => void;
  };
  // eslint-disable-next-line import/no-default-export
  export default basicHTMLElements;
}

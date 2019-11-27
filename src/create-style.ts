import { HTMLElementContent, HTMLFragment } from './types';
import { html } from './create-html';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createStyle = (styleContent: HTMLElementContent): HTMLFragment => (html as any)`
  <style>${typeof styleContent === 'string' ? styleContent : styleContent.toString()}</style>
`;

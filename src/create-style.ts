import { HTMLElementContent, HTMLFragment } from './types';
import { html } from './create-html';

export const createStyle = (styleContent: HTMLElementContent): HTMLFragment => html`
  <style>${typeof styleContent === 'string' ? styleContent : styleContent.toString()}</style>
`;

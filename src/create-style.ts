import { HTMLElementContent } from './types';

export const createStyle = (styleContent: HTMLElementContent): HTMLStyleElement => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = typeof styleContent === 'string'
    ? styleContent
    : styleContent.toString();

  return styleElement;
};

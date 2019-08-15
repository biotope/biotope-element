import { attributeName, attributeValue } from './attribute-mapper';
import { ComponentInstance } from './types';

const kebabToCamel = (string: string): string => string.replace(/-([a-z])/g, (_, item): string => item.toUpperCase());

export const attributeChangedCallback = (
  // FIXME - false positive on linting
  // eslint-disable-next-line arrow-parens
  context: ComponentInstance, name: string, oldValue: string, newValue: string,
): void => {
  const attribute = context.constructor.attributes
    .filter((attr): boolean => attributeName(attr) === name)[0];

  if (attribute) {
    // eslint-disable-next-line no-underscore-dangle,no-param-reassign
    context.__currentProps = {
      ...context.props,
      [kebabToCamel(name)]: attributeValue(attribute, newValue),
    };
    context.render();
  }
};

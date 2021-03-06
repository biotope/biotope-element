import { attributeName, attributeValue } from './attribute-mapper';
import { kebabToCamel } from './converters';
import { ComponentInstance } from './internal-types';
import { PropValue } from './types';

export const attributeChangedCallback = (
  context: ComponentInstance, name: string, previous: PropValue, current: PropValue,
): void => {
  const attribute = context.constructor.attributes
    .filter((attr): boolean => attributeName(attr) === name)[0];

  if (attribute) {
    const nameCamel = kebabToCamel(name);
    const currentValue = attributeValue(attribute, current);

    if (currentValue !== context.props[nameCamel]) {
      // eslint-disable-next-line no-underscore-dangle,no-param-reassign
      context.__currentProps = {
        ...context.props,
        [nameCamel]: currentValue,
      };
      context.render();
    }
  }
};

// eslint-disable-next-line import/no-extraneous-dependencies
import { templateToFunctionString } from '@biotope/element/src/render-template';

module.exports = (source: string): string => `export default ${templateToFunctionString(source)};`;

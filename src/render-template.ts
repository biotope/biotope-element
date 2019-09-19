import { HTMLFragment } from './types';
import { ComponentInstance, RenderFunction } from './internal-types';

interface Level {
  line: number;
  elseLine?: number;
}

type HelperFunction = (index: number, levelStarts: Level[], parsedTemplate: string[]) => void;

const TEMPLATE_START = '<%';
const TEMPLATE_END = '%>';
const TEMPLATE_LITERAL_START = '<${%';
const TEMPLATE_LITERAL_END = '%}$>';

const newArray = (length: number): undefined[] => [...Array(length)];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const startsWith = (haystack: string, needles: any | any[]): string | false => (
  Array.isArray(needles) ? needles : [needles]
).filter((needle): boolean => {
  const starter = needle.indexOf('end') === 0 || needle.indexOf('else') === 0
    ? needle.toString() : `${needle.toString()} `;
  return haystack.trim().toUpperCase().indexOf(starter.toUpperCase()) === 0;
})[0] || false;

const getValue = (value: string, context: ComponentInstance): object => (
  // eslint-disable-next-line no-new-func
  new Function(`return ${value}`)
).bind(context)();

const customTemplate = (content: string): string => `${TEMPLATE_LITERAL_START}${content}${TEMPLATE_LITERAL_END}`;

const splitTemplate = (content: string, splitStart: string, splitEnd: string): string[] => content
  .split(splitStart)
  .reduce(((accumulator, str): string[] => ([
    ...accumulator,
    ...str.split(splitEnd),
  ])), []);

const es5ThisHtml = (content: string): string => {
  const contentSplit = splitTemplate(content, TEMPLATE_LITERAL_START, TEMPLATE_LITERAL_END);
  const templates = contentSplit.filter((_, index): boolean => index % 2 === 0);
  const args = contentSplit.filter((_, index): boolean => index % 2 === 1);

  return `this.html(${JSON.stringify(templates)}${args.length ? ',' : ''}${args.toString()})`;
};

const templateHelpers: { [key: string]: HelperFunction } = {
  /* eslint-disable no-param-reassign */
  if(index, levelStarts): void {
    levelStarts.push({ line: index });
  },
  else(index, levelStarts): void {
    levelStarts[levelStarts.length - 1].elseLine = index;
  },
  endIf(index, levelStarts, parsedTemplate): void {
    const start = levelStarts.pop();
    const condition = parsedTemplate[start.line].trim().split('if').slice(1).join('if');

    const content = parsedTemplate.slice(
      start.line + 1,
      start.elseLine !== undefined ? start.elseLine : index,
    ).join('');

    const contentFalse = start.elseLine !== undefined
      ? es5ThisHtml(parsedTemplate.slice(start.elseLine + 1, index - 2).join(''))
      : null;

    parsedTemplate[start.line] = customTemplate(
      `${condition} ? ${es5ThisHtml(content)} : ${contentFalse}`,
    );

    newArray(index - start.line).forEach((_, line): void => {
      parsedTemplate[start.line + 1 + line] = '';
    });
  },

  for(index, levelStarts): void {
    levelStarts.push({ line: index });
  },
  endFor(index, levelStarts, parsedTemplate): void {
    const start = levelStarts.pop();
    const [, item, , ...arraySplit] = parsedTemplate[start.line].trim().split(' ');
    const content = parsedTemplate.slice(start.line + 1, index).join('');

    parsedTemplate[start.line] = customTemplate(
      `(${arraySplit.join(' ')}).map((function(${item}) { return ${es5ThisHtml(content)} }).bind(this))`,
    );

    newArray(index - start.line).forEach((_, line): void => {
      parsedTemplate[start.line + 1 + line] = '';
    });
  },

  log(index, _, parsedTemplate): void {
    const [, ...valueSplit] = parsedTemplate[index].split('log');

    parsedTemplate[index] = customTemplate(`console.log(${valueSplit.join('log')})`);
  },
  /* eslint-enable no-param-reassign */
};

export const templateToFunctionString = (
  template = '', splitStart: string = TEMPLATE_START, splitEnd: string = TEMPLATE_END,
): string => {
  const levelStarts: Level[] = [];

  // remove comments and parse strings from args
  const parsedTemplate: string[] = splitTemplate(template.replace(/<!--[\s\S]*?-->/g, ''), splitStart, splitEnd);

  // parse regular variables and values
  parsedTemplate
    .filter((_, index): boolean => index % 2 === 1)
    .forEach((arg, index): void => {
      if (!startsWith(arg, Object.keys(templateHelpers))) {
        parsedTemplate[index * 2] += customTemplate(arg.trim()); // append to string before "arg"
        parsedTemplate[index * 2 + 1] = ''; // remove current "arg" value
      }
    });

  // parse custom templating entries
  parsedTemplate
    .filter((_, index): boolean => index % 2 === 1)
    .forEach((arg, index): void => {
      const helper = startsWith(arg, Object.keys(templateHelpers));
      if (helper) {
        templateHelpers[helper](index * 2 + 1, levelStarts, parsedTemplate);
      }
    });

  return `function() { return ${es5ThisHtml(parsedTemplate.join(''))}; }`;
};

export const renderTemplate = (
  context: ComponentInstance, template: string | RenderFunction = '',
): HTMLFragment => {
  if (typeof template === 'function') {
    return template.bind(context)();
  }

  return (getValue(
    `(${template.indexOf('function') === 0 ? template : templateToFunctionString(template)}).bind(this)`,
    context,
  ) as RenderFunction)() as HTMLFragment;
};

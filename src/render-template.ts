import { ComponentInstance } from './internal-types';

interface Level {
  line: number;
  elseLine?: number;
}

const TEMPLATE_START = '{{';
const TEMPLATE_END = '}}';
const TEMPLATE_LITERAL_START = '{#?{';
const TEMPLATE_LITERAL_END = '}#?}';

const newArray = (length: number): undefined[] => [...Array(length)];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const startsWith = (haystack: string, needles: any | any[]): boolean => (Array.isArray(needles)
  ? needles
  : [needles]).some((needle): boolean => haystack.toString().indexOf(needle.toString()) === 0);

const getIfArg = (line: string): string => line.split('if').slice(1).join('if').trim();

const getForArgs = (line: string): { item: string; array: string } => {
  const [, item, , ...arraySplit] = line.split(' ');
  return {
    item,
    array: arraySplit.join(' '),
  };
};

const getValue = (value: string, context: ComponentInstance): object => (
  // eslint-disable-next-line no-new-func
  new Function(`return ${value}`)
).bind(context)();

const customTemplate = (content: string): string => `${TEMPLATE_LITERAL_START}${content}${TEMPLATE_LITERAL_END}`;

const splitByStartAndEnd = (
  content: string, splitStart: string = TEMPLATE_START, splitEnd: string = TEMPLATE_END,
): string[] => content
  .split(splitStart)
  .reduce(((accumulator, str): string[] => ([
    ...accumulator,
    ...str.split(splitEnd),
  ])), []);

const es5ThisHtml = (content: string): string => {
  const contentSplit = splitByStartAndEnd(content, TEMPLATE_LITERAL_START, TEMPLATE_LITERAL_END);
  const templates = contentSplit.filter((_, index): boolean => index % 2 === 0);
  const args = contentSplit.filter((_, index): boolean => index % 2 === 1);

  return `this.html(${JSON.stringify(templates)}${args.length ? ',' : ''}${args.toString()})`;
};

export const renderTemplate = (context: ComponentInstance, template: string = ''): HTMLElement => {
  const levelStarts: Level[] = [];

  // remove comments and parse strings from args
  const parsedTemplate: string[] = splitByStartAndEnd(template.replace(/<!--[\s\S]*?-->/g, ''));

  // parse regular variables and values
  parsedTemplate
    .filter((_, index): boolean => index % 2 === 1)
    .map((arg): string => arg.trim())
    .forEach((arg, index): void => {
      if (!startsWith(arg, ['if ', 'else', 'endif', 'for ', 'endfor', 'log'])) {
        parsedTemplate[index * 2] += customTemplate(arg); // append to string before "arg"
        parsedTemplate[index * 2 + 1] = ''; // remove current "arg" value
      }
    });

  // parse custom templating entries
  parsedTemplate
    .filter((_, index): boolean => index % 2 === 1)
    .map((arg): string => arg.trim())
    .forEach((arg, index): void => {
      if (startsWith(arg, ['if ', 'for '])) {
        levelStarts.push({ line: index });
      }
      if (startsWith(arg, 'else')) {
        levelStarts[levelStarts.length - 1].elseLine = index;
      }
      if (startsWith(arg, 'endif')) {
        const start = levelStarts.pop();
        const condition = getIfArg(parsedTemplate[start.line * 2 + 1].trim());
        const content = parsedTemplate.slice(start.line * 2 + 2, start.elseLine === undefined ? index * 2 + 1 : start.elseLine * 2 + 1).join('');
        const contentFalse = start.elseLine !== undefined
          ? es5ThisHtml(parsedTemplate.slice(start.elseLine * 2 + 2, index * 2 - 1).join(''))
          : null;
        parsedTemplate[start.line * 2 + 1] = customTemplate(`${condition} ? ${es5ThisHtml(content)} : ${contentFalse}`);
        newArray((index - start.line) * 2).forEach((_, line): void => {
          parsedTemplate[start.line * 2 + 2 + line] = '';
        });
      }
      if (startsWith(arg, 'endfor')) {
        const start = levelStarts.pop();
        const { item, array } = getForArgs(parsedTemplate[start.line * 2 + 1].trim());
        const content = parsedTemplate.slice(start.line * 2 + 2, index * 2 + 1).join('');
        parsedTemplate[start.line * 2 + 1] = customTemplate(`(${array}).map((function(${item}) { return ${es5ThisHtml(content)} }).bind(this))`);
        newArray((index - start.line) * 2).forEach((_, line): void => {
          parsedTemplate[start.line * 2 + 2 + line] = '';
        });
      }
      if (startsWith(arg, 'log ')) {
        const [, ...valueSplit] = arg.split('log');
        parsedTemplate[index * 2 + 1] = customTemplate(`console.log(${valueSplit.join('log')})`);
      }
    });

  return getValue(es5ThisHtml(parsedTemplate.join('')), context) as HTMLElement;
};

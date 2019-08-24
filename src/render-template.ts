import { ComponentInstance } from './internal-types';

interface Level {
  line: number;
  elseLine?: number;
}

interface HelperArguments {
  index: number;
  levelStarts: Level[];
  parsedTemplate: string[];
}

const TEMPLATE_START = '{{';
const TEMPLATE_END = '}}';
const TEMPLATE_LITERAL_START = '{#?{';
const TEMPLATE_LITERAL_END = '}#?}';

const newArray = (length: number): undefined[] => [...Array(length)];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const startsWith = (haystack: string, needles: any | any[]): boolean => (
  Array.isArray(needles) ? needles : [needles]
).some((needle): boolean => haystack.toUpperCase().indexOf(needle.toString().toUpperCase()) === 0);

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

const templateHelpers: { [key: string]: (...HelperArguments) => void } = {
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

export const renderTemplate = (context: ComponentInstance, template: string = ''): HTMLElement => {
  const levelStarts: Level[] = [];

  // remove comments and parse strings from args
  const parsedTemplate: string[] = splitByStartAndEnd(template.replace(/<!--[\s\S]*?-->/g, ''));

  // parse regular variables and values
  parsedTemplate
    .filter((_, index): boolean => index % 2 === 1)
    .map((arg): string => arg.trim())
    .forEach((arg, index): void => {
      if (!startsWith(arg, Object.keys(templateHelpers))) {
        parsedTemplate[index * 2] += customTemplate(arg); // append to string before "arg"
        parsedTemplate[index * 2 + 1] = ''; // remove current "arg" value
      }
    });

  // parse custom templating entries
  parsedTemplate
    .filter((_, index): boolean => index % 2 === 1)
    .forEach((arg, index): void => Object.keys(templateHelpers).forEach((helper): void => {
      if (startsWith(arg.trim(), helper)) {
        templateHelpers[helper](index * 2 + 1, levelStarts, parsedTemplate);
      }
    }));

  return getValue(es5ThisHtml(parsedTemplate.join('')), context) as HTMLElement;
};

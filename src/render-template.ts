import { ComponentInstance } from './internal-types';

interface Level {
  line: number;
  elseLine?: number;
}

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

export const renderTemplate = (context: ComponentInstance, template: string = '', splitStart: string = '{{', splitEnd: string = '}}'): HTMLElement => {
  const levelStarts: Level[] = [];

  // remove comments and parse strings from args
  const parsedTemplate: string[] = template.replace(/<!--[\s\S]*?-->/g, '')
    .split(splitStart)
    .reduce(((accumulator, str): string[] => ([
      ...accumulator,
      ...str.split(splitEnd),
    ])), []);

  // parse regular variables and values
  parsedTemplate
    .filter((_, index): boolean => index % 2 === 1)
    .map((arg): string => arg.trim())
    .forEach((arg, index): void => {
      if (!startsWith(arg, ['if ', 'else', 'endif', 'for ', 'endfor', 'log'])) {
        parsedTemplate[index * 2] += `\${${arg}}`; // append to string before "arg"
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
          ? `this.html\`${parsedTemplate.slice(start.elseLine * 2 + 2, index * 2 - 1).join('')}\``
          : null;
        parsedTemplate[start.line * 2 + 1] = `\${${condition} ? this.html\`${content}\` : ${contentFalse}}`;
        newArray((index - start.line) * 2).forEach((_, line): void => {
          parsedTemplate[start.line * 2 + 2 + line] = '';
        });
      }
      if (startsWith(arg, 'endfor')) {
        const start = levelStarts.pop();
        const { item, array } = getForArgs(parsedTemplate[start.line * 2 + 1].trim());
        const content = parsedTemplate.slice(start.line * 2 + 2, index * 2 + 1).join('');
        parsedTemplate[start.line * 2 + 1] = `\${(${array}).map((function(${item}) { return this.html\`${content}\` }).bind(this))}`;
        newArray((index - start.line) * 2).forEach((_, line): void => {
          parsedTemplate[start.line * 2 + 2 + line] = '';
        });
      }
      if (startsWith(arg, 'log ')) {
        const [, ...valueSplit] = arg.split('log');
        parsedTemplate[index * 2 + 1] = `\${console.log(${valueSplit.join('log')})}`;
      }
    });

  return getValue(`this.html\`${parsedTemplate.join('')}\``, context) as HTMLElement;
};

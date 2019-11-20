// TODO Remove when https://github.com/WebReflection/domtagger/issues/20 is properly fixed

const { readFileSync, writeFileSync } = require('fs');

const filename = './node_modules/domtagger/esm/walker.js';

const content = readFileSync(filename).toString().replace(
  'var array = remove.slice.call(attributes, 0);',
  'var html = parts.join(\'\'); var array = remove.slice.call(attributes, 0).sort(function(left, right) { return html.indexOf(left.name) <= html.indexOf(right.name) ? -1 : 1; });',
);

writeFileSync(filename, content);

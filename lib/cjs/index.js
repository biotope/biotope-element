'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const kebabToCamel = (string) => string.replace(/-([a-z])/g, (_, item) => item.toUpperCase());
const camelToKebab = (string) => string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const getComponentName = (context) => context.componentName
    || camelToKebab(context.name || context.toString().match(/^function\s*([^\s(]+)/)[1]);

const isRegistered = (name) => {
    switch (document.createElement(name).constructor) {
        case HTMLElement: return false;
        case HTMLUnknownElement: return false;
        default: return true;
    }
};

const parseOrUndefined = (value) => {
    try {
        return JSON.parse(value);
    }
    catch (_) {
        return undefined;
    }
};
const toBoolean = (prop) => {
    if (typeof prop === 'boolean') {
        return prop;
    }
    return (!!prop && prop !== 'false') || prop === '';
};
const toNumber = (prop) => {
    if (typeof prop === 'number') {
        return prop;
    }
    let convertedProp = +prop;
    // eslint-disable-next-line no-self-compare
    if (convertedProp !== convertedProp) { // if (is NaN)
        const float = parseFloat(prop);
        convertedProp = float || float === 0 ? float : convertedProp;
    }
    return convertedProp;
};
const toArray = (prop) => {
    if (Array.isArray(prop)) {
        return prop;
    }
    if (typeof prop === 'string') {
        const convertedProp = parseOrUndefined(prop);
        return typeof convertedProp !== 'object' ? null : Object.keys(convertedProp)
            .reduce((accumulator, key) => ([
            ...accumulator,
            convertedProp[key],
        ]), []);
    }
    if (prop) {
        try {
            return Object.keys(prop).reduce((acc, key) => ([...acc, prop[key]]), []);
            // eslint-disable-next-line no-empty
        }
        catch (_) { }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return [...(new Array(prop))];
};
const toObject = (prop) => {
    if (typeof prop === 'object' && !Array.isArray(prop)) {
        return prop;
    }
    if (typeof prop === 'string') {
        const convertedProp = parseOrUndefined(prop);
        return typeof convertedProp !== 'object' ? null : Object.keys(convertedProp)
            .reduce((accumulator, key) => (Object.assign(Object.assign({}, accumulator), { [key]: convertedProp[key] })), {});
    }
    if (prop) {
        try {
            return Object.keys(prop).reduce((acc, key) => (Object.assign(Object.assign({}, acc), { [key]: prop[key] })), {});
            // eslint-disable-next-line no-empty
        }
        catch (_) { }
    }
    return [...(new Array(prop))].reduce((acc, value, index) => (Object.assign(Object.assign({}, acc), { [index]: value })), {});
};
const toFunction = (prop) => {
    if (typeof prop === 'function') {
        return prop;
    }
    try {
        // eslint-disable-next-line no-new-func
        return (new Function(`return ${prop};`))();
    }
    catch (_) {
        return null;
    }
};
const toString = (prop) => {
    if (typeof prop === 'string') {
        return prop;
    }
    if (!prop || typeof prop.toString !== 'function') {
        return null;
    }
    return prop.toString();
};

const attributeName = (attribute) => (typeof attribute === 'string' ? attribute : attribute.name);
const attributeValue = (attribute, value) => {
    if (typeof attribute === 'string') {
        return value;
    }
    if (typeof attribute.converter === 'function') {
        return attribute.converter(value);
    }
    switch (attribute.type || 'string') {
        case 'boolean':
            return toBoolean(value);
        case 'number':
            return toNumber(value);
        case 'array':
            return toArray(value);
        case 'object':
            return toObject(value);
        case 'function':
            return toFunction(value);
        case 'string':
        default:
            return toString(value);
    }
};

const register = (context, outputToConsole) => {
    /* eslint-disable no-param-reassign,no-underscore-dangle,func-names */
    const dashedName = getComponentName(context);
    if (!context.componentName) {
        if (outputToConsole) {
            // eslint-disable-next-line no-console
            console.warn(`Static property "componentName" missing. Setting it to "${dashedName}"…`);
        }
        context.componentName = dashedName;
    }
    if (isRegistered(context.componentName)) {
        if (outputToConsole) {
            // eslint-disable-next-line no-console
            console.warn(`Attempt to re-register component "${context.componentName}". Skipping…`);
        }
        return false;
    }
    context.dependencies.forEach((component) => component.register(outputToConsole));
    const allAttributes = (context.attributes && context.attributes.length ? context.attributes : [])
        .filter((attribute) => attribute);
    context.observedAttributes = allAttributes.map(attributeName);
    allAttributes.forEach((attribute) => {
        const name = attributeName(attribute);
        const nameCamel = kebabToCamel(name);
        const prop = {
            get() {
                return this.props[nameCamel];
            },
            set(value) {
                if (value === null || value === undefined || value === false || value === 'false') {
                    this.removeAttribute(name);
                }
                else if (typeof value === 'string') {
                    this.setAttribute(name, value);
                }
                this.attributeChangedCallback(name, this.props[nameCamel], value);
            },
        };
        Object.defineProperty(context.prototype, name, prop);
        Object.defineProperty(context.prototype, nameCamel, prop);
    });
    const originalConnectedCallback = context.prototype.connectedCallback;
    context.prototype.connectedCallback = function () {
        const instance = this;
        originalConnectedCallback.bind(instance)();
        while (instance.__attributeChangedCallbackStack.length) {
            instance.__attributeChangedCallbackStack.pop()();
        }
        instance.__created = true;
        instance.render();
        instance.emit('connected', undefined, true);
    };
    const originalAttributeChangedCallback = context.prototype.attributeChangedCallback;
    context.prototype.attributeChangedCallback = function (...args) {
        const instance = this;
        const callFunction = () => {
            originalAttributeChangedCallback.bind(instance)(...args);
            instance.emit('attributechanged', undefined, true);
        };
        if (instance.__created) {
            callFunction();
        }
        else {
            instance.__attributeChangedCallbackStack.unshift(callFunction);
        }
    };
    const originalDisconnectedCallback = context.prototype.disconnectedCallback;
    context.prototype.disconnectedCallback = function () {
        const instance = this;
        originalDisconnectedCallback.bind(instance)();
        instance.emit('disconnected', undefined, true);
    };
    customElements.define(context.componentName, context);
    return true;
    /* eslint-enable no-param-reassign,no-underscore-dangle,func-names */
};

/*! (c) Andrea Giammarchi - ISC */
var self = null || /* istanbul ignore next */ {};
try { self.WeakMap = WeakMap; }
catch (WeakMap) {
  // this could be better but 90% of the time
  // it's everything developers need as fallback
  self.WeakMap = (function (id, Object) {    var dP = Object.defineProperty;
    var hOP = Object.hasOwnProperty;
    var proto = WeakMap.prototype;
    proto.delete = function (key) {
      return this.has(key) && delete key[this._];
    };
    proto.get = function (key) {
      return this.has(key) ? key[this._] : void 0;
    };
    proto.has = function (key) {
      return hOP.call(key, this._);
    };
    proto.set = function (key, value) {
      dP(key, this._, {configurable: true, value: value});
      return this;
    };
    return WeakMap;
    function WeakMap(iterable) {
      dP(this, '_', {value: '_@ungap/weakmap' + id++});
      if (iterable)
        iterable.forEach(add, this);
    }
    function add(pair) {
      this.set(pair[0], pair[1]);
    }
  }(Math.random(), Object));
}
var WeakMap$1 = self.WeakMap;

var isNoOp = typeof document !== 'object';

var templateLiteral = function (tl) {
  var RAW = 'raw';
  var isBroken = function (UA) {
    return /(Firefox|Safari)\/(\d+)/.test(UA) &&
          !/(Chrom[eium]+|Android)\/(\d+)/.test(UA);
  };
  var broken = isBroken((document.defaultView.navigator || {}).userAgent);
  var FTS = !(RAW in tl) ||
            tl.propertyIsEnumerable(RAW) ||
            !Object.isFrozen(tl[RAW]);
  if (broken || FTS) {
    var forever = {};
    var foreverCache = function (tl) {
      for (var key = '.', i = 0; i < tl.length; i++)
        key += tl[i].length + '.' + tl[i];
      return forever[key] || (forever[key] = tl);
    };
    // Fallback TypeScript shenanigans
    if (FTS)
      templateLiteral = foreverCache;
    // try fast path for other browsers:
    // store the template as WeakMap key
    // and forever cache it only when it's not there.
    // this way performance is still optimal,
    // penalized only when there are GC issues
    else {
      var wm = new WeakMap$1;
      var set = function (tl, unique) {
        wm.set(tl, unique);
        return unique;
      };
      templateLiteral = function (tl) {
        return wm.get(tl) || set(tl, foreverCache(tl));
      };
    }
  } else {
    isNoOp = true;
  }
  return TL(tl);
};

function TL(tl) {
  return isNoOp ? tl : templateLiteral(tl);
}

function tta (template) {
  var length = arguments.length;
  var args = [TL(template)];
  var i = 1;
  while (i < length)
    args.push(arguments[i++]);
  return args;
}

/*! (c) Andrea Giammarchi - ISC */

// Custom
var UID = '-' + Math.random().toFixed(6) + '%';
//                           Edge issue!

var UID_IE = false;

try {
  if (!(function (template, content, tabindex) {
    return content in template && (
      (template.innerHTML = '<p ' + tabindex + '="' + UID + '"></p>'),
      template[content].childNodes[0].getAttribute(tabindex) == UID
    );
  }(document.createElement('template'), 'content', 'tabindex'))) {
    UID = '_dt: ' + UID.slice(1, -1) + ';';
    UID_IE = true;
  }
} catch(meh) {}

var UIDC = '<!--' + UID + '-->';

// DOM
var COMMENT_NODE = 8;
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;

var SHOULD_USE_TEXT_CONTENT = /^(?:style|textarea)$/i;
var VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;

/*! (c) Andrea Giammarchi - ISC */

function domsanitizer (template) {
  return template.join(UIDC)
          .replace(selfClosing, fullClosing)
          .replace(attrSeeker, attrReplacer);
}

var spaces = ' \\f\\n\\r\\t';
var almostEverything = '[^' + spaces + '\\/>"\'=]+';
var attrName = '[' + spaces + ']+' + almostEverything;
var tagName = '<([A-Za-z]+[A-Za-z0-9:._-]*)((?:';
var attrPartials = '(?:\\s*=\\s*(?:\'[^\']*?\'|"[^"]*?"|<[^>]*?>|' + almostEverything.replace('\\/', '') + '))?)';

var attrSeeker = new RegExp(tagName + attrName + attrPartials + '+)([' + spaces + ']*/?>)', 'g');
var selfClosing = new RegExp(tagName + attrName + attrPartials + '*)([' + spaces + ']*/>)', 'g');
var findAttributes = new RegExp('(' + attrName + '\\s*=\\s*)([\'"]?)' + UIDC + '\\2', 'gi');

function attrReplacer($0, $1, $2, $3) {
  return '<' + $1 + $2.replace(findAttributes, replaceAttributes) + $3;
}

function replaceAttributes($0, $1, $2) {
  return $1 + ($2 || '"') + UID + ($2 || '"');
}

function fullClosing($0, $1, $2) {
  return VOID_ELEMENTS.test($1) ? $0 : ('<' + $1 + $2 + '></' + $1 + '>');
}

/*! (c) Andrea Giammarchi - ISC */
var createContent = (function (document) {  var FRAGMENT = 'fragment';
  var TEMPLATE = 'template';
  var HAS_CONTENT = 'content' in create(TEMPLATE);

  var createHTML = HAS_CONTENT ?
    function (html) {
      var template = create(TEMPLATE);
      template.innerHTML = html;
      return template.content;
    } :
    function (html) {
      var content = create(FRAGMENT);
      var template = create(TEMPLATE);
      var childNodes = null;
      if (/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(html)) {
        var selector = RegExp.$1;
        template.innerHTML = '<table>' + html + '</table>';
        childNodes = template.querySelectorAll(selector);
      } else {
        template.innerHTML = html;
        childNodes = template.childNodes;
      }
      append(content, childNodes);
      return content;
    };

  return function createContent(markup, type) {
    return (type === 'svg' ? createSVG : createHTML)(markup);
  };

  function append(root, childNodes) {
    var length = childNodes.length;
    while (length--)
      root.appendChild(childNodes[0]);
  }

  function create(element) {
    return element === FRAGMENT ?
      document.createDocumentFragment() :
      document.createElementNS('http://www.w3.org/1999/xhtml', element);
  }

  // it could use createElementNS when hasNode is there
  // but this fallback is equally fast and easier to maintain
  // it is also battle tested already in all IE
  function createSVG(svg) {
    var content = create(FRAGMENT);
    var template = create('div');
    template.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + svg + '</svg>';
    append(content, template.firstChild.childNodes);
    return content;
  }

}(document));

/*! (c) Andrea Giammarchi - ISC */
var self$1 = null || /* istanbul ignore next */ {};
try { self$1.Map = Map; }
catch (Map) {
  self$1.Map = function Map() {
    var i = 0;
    var k = [];
    var v = [];
    return {
      delete: function (key) {
        var had = contains(key);
        if (had) {
          k.splice(i, 1);
          v.splice(i, 1);
        }
        return had;
      },
      forEach: function forEach(callback, context) {
        k.forEach(
          function (key, i)  {
            callback.call(context, v[i], key, this);
          },
          this
        );
      },
      get: function get(key) {
        return contains(key) ? v[i] : void 0;
      },
      has: function has(key) {
        return contains(key);
      },
      set: function set(key, value) {
        v[contains(key) ? i : (k.push(key) - 1)] = value;
        return this;
      }
    };
    function contains(v) {
      i = k.indexOf(v);
      return -1 < i;
    }
  };
}
var Map$1 = self$1.Map;

const {indexOf: iOF} = [];
const append = (get, parent, children, start, end, before) => {
  const isSelect = 'selectedIndex' in parent;
  let noSelection = isSelect;
  while (start < end) {
    const child = get(children[start], 1);
    parent.insertBefore(child, before);
    if (isSelect && noSelection && child.selected) {
      noSelection = !noSelection;
      let {selectedIndex} = parent;
      parent.selectedIndex = selectedIndex < 0 ?
        start :
        iOF.call(parent.querySelectorAll('option'), child);
    }
    start++;
  }
};

const eqeq = (a, b) => a == b;

const identity = O => O;

const indexOf = (
  moreNodes,
  moreStart,
  moreEnd,
  lessNodes,
  lessStart,
  lessEnd,
  compare
) => {
  const length = lessEnd - lessStart;
  /* istanbul ignore if */
  if (length < 1)
    return -1;
  while ((moreEnd - moreStart) >= length) {
    let m = moreStart;
    let l = lessStart;
    while (
      m < moreEnd &&
      l < lessEnd &&
      compare(moreNodes[m], lessNodes[l])
    ) {
      m++;
      l++;
    }
    if (l === lessEnd)
      return moreStart;
    moreStart = m + 1;
  }
  return -1;
};

const isReversed = (
  futureNodes,
  futureEnd,
  currentNodes,
  currentStart,
  currentEnd,
  compare
) => {
  while (
    currentStart < currentEnd &&
    compare(
      currentNodes[currentStart],
      futureNodes[futureEnd - 1]
    )) {
      currentStart++;
      futureEnd--;
    }  return futureEnd === 0;
};

const next = (get, list, i, length, before) => i < length ?
              get(list[i], 0) :
              (0 < i ?
                get(list[i - 1], -0).nextSibling :
                before);

const remove = (get, children, start, end) => {
  while (start < end)
    drop(get(children[start++], -1));
};

// - - - - - - - - - - - - - - - - - - -
// diff related constants and utilities
// - - - - - - - - - - - - - - - - - - -

const DELETION = -1;
const INSERTION = 1;
const SKIP = 0;
const SKIP_OND = 50;

const HS = (
  futureNodes,
  futureStart,
  futureEnd,
  futureChanges,
  currentNodes,
  currentStart,
  currentEnd,
  currentChanges
) => {

  let k = 0;
  /* istanbul ignore next */
  let minLen = futureChanges < currentChanges ? futureChanges : currentChanges;
  const link = Array(minLen++);
  const tresh = Array(minLen);
  tresh[0] = -1;

  for (let i = 1; i < minLen; i++)
    tresh[i] = currentEnd;

  const keymap = new Map$1;
  for (let i = currentStart; i < currentEnd; i++)
    keymap.set(currentNodes[i], i);

  for (let i = futureStart; i < futureEnd; i++) {
    const idxInOld = keymap.get(futureNodes[i]);
    if (idxInOld != null) {
      k = findK(tresh, minLen, idxInOld);
      /* istanbul ignore else */
      if (-1 < k) {
        tresh[k] = idxInOld;
        link[k] = {
          newi: i,
          oldi: idxInOld,
          prev: link[k - 1]
        };
      }
    }
  }

  k = --minLen;
  --currentEnd;
  while (tresh[k] > currentEnd) --k;

  minLen = currentChanges + futureChanges - k;
  const diff = Array(minLen);
  let ptr = link[k];
  --futureEnd;
  while (ptr) {
    const {newi, oldi} = ptr;
    while (futureEnd > newi) {
      diff[--minLen] = INSERTION;
      --futureEnd;
    }
    while (currentEnd > oldi) {
      diff[--minLen] = DELETION;
      --currentEnd;
    }
    diff[--minLen] = SKIP;
    --futureEnd;
    --currentEnd;
    ptr = ptr.prev;
  }
  while (futureEnd >= futureStart) {
    diff[--minLen] = INSERTION;
    --futureEnd;
  }
  while (currentEnd >= currentStart) {
    diff[--minLen] = DELETION;
    --currentEnd;
  }
  return diff;
};

// this is pretty much the same petit-dom code without the delete map part
// https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L556-L561
const OND = (
  futureNodes,
  futureStart,
  rows,
  currentNodes,
  currentStart,
  cols,
  compare
) => {
  const length = rows + cols;
  const v = [];
  let d, k, r, c, pv, cv, pd;
  outer: for (d = 0; d <= length; d++) {
    /* istanbul ignore if */
    if (d > SKIP_OND)
      return null;
    pd = d - 1;
    /* istanbul ignore next */
    pv = d ? v[d - 1] : [0, 0];
    cv = v[d] = [];
    for (k = -d; k <= d; k += 2) {
      if (k === -d || (k !== d && pv[pd + k - 1] < pv[pd + k + 1])) {
        c = pv[pd + k + 1];
      } else {
        c = pv[pd + k - 1] + 1;
      }
      r = c - k;
      while (
        c < cols &&
        r < rows &&
        compare(
          currentNodes[currentStart + c],
          futureNodes[futureStart + r]
        )
      ) {
        c++;
        r++;
      }
      if (c === cols && r === rows) {
        break outer;
      }
      cv[d + k] = c;
    }
  }

  const diff = Array(d / 2 + length / 2);
  let diffIdx = diff.length - 1;
  for (d = v.length - 1; d >= 0; d--) {
    while (
      c > 0 &&
      r > 0 &&
      compare(
        currentNodes[currentStart + c - 1],
        futureNodes[futureStart + r - 1]
      )
    ) {
      // diagonal edge = equality
      diff[diffIdx--] = SKIP;
      c--;
      r--;
    }
    if (!d)
      break;
    pd = d - 1;
    /* istanbul ignore next */
    pv = d ? v[d - 1] : [0, 0];
    k = c - r;
    if (k === -d || (k !== d && pv[pd + k - 1] < pv[pd + k + 1])) {
      // vertical edge = insertion
      r--;
      diff[diffIdx--] = INSERTION;
    } else {
      // horizontal edge = deletion
      c--;
      diff[diffIdx--] = DELETION;
    }
  }
  return diff;
};

const applyDiff = (
  diff,
  get,
  parentNode,
  futureNodes,
  futureStart,
  currentNodes,
  currentStart,
  currentLength,
  before
) => {
  const live = new Map$1;
  const length = diff.length;
  let currentIndex = currentStart;
  let i = 0;
  while (i < length) {
    switch (diff[i++]) {
      case SKIP:
        futureStart++;
        currentIndex++;
        break;
      case INSERTION:
        // TODO: bulk appends for sequential nodes
        live.set(futureNodes[futureStart], 1);
        append(
          get,
          parentNode,
          futureNodes,
          futureStart++,
          futureStart,
          currentIndex < currentLength ?
            get(currentNodes[currentIndex], 0) :
            before
        );
        break;
      case DELETION:
        currentIndex++;
        break;
    }
  }
  i = 0;
  while (i < length) {
    switch (diff[i++]) {
      case SKIP:
        currentStart++;
        break;
      case DELETION:
        // TODO: bulk removes for sequential nodes
        if (live.has(currentNodes[currentStart]))
          currentStart++;
        else
          remove(
            get,
            currentNodes,
            currentStart++,
            currentStart
          );
        break;
    }
  }
};

const findK = (ktr, length, j) => {
  let lo = 1;
  let hi = length;
  while (lo < hi) {
    const mid = ((lo + hi) / 2) >>> 0;
    if (j < ktr[mid])
      hi = mid;
    else
      lo = mid + 1;
  }
  return lo;
};

const smartDiff = (
  get,
  parentNode,
  futureNodes,
  futureStart,
  futureEnd,
  futureChanges,
  currentNodes,
  currentStart,
  currentEnd,
  currentChanges,
  currentLength,
  compare,
  before
) => {
  applyDiff(
    OND(
      futureNodes,
      futureStart,
      futureChanges,
      currentNodes,
      currentStart,
      currentChanges,
      compare
    ) ||
    HS(
      futureNodes,
      futureStart,
      futureEnd,
      futureChanges,
      currentNodes,
      currentStart,
      currentEnd,
      currentChanges
    ),
    get,
    parentNode,
    futureNodes,
    futureStart,
    currentNodes,
    currentStart,
    currentLength,
    before
  );
};

const drop = node => (node.remove || dropChild).call(node);

function dropChild() {
  const {parentNode} = this;
  /* istanbul ignore else */
  if (parentNode)
    parentNode.removeChild(this);
}

/*! (c) 2018 Andrea Giammarchi (ISC) */

const domdiff = (
  parentNode,     // where changes happen
  currentNodes,   // Array of current items/nodes
  futureNodes,    // Array of future items/nodes
  options         // optional object with one of the following properties
                  //  before: domNode
                  //  compare(generic, generic) => true if same generic
                  //  node(generic) => Node
) => {
  if (!options)
    options = {};

  const compare = options.compare || eqeq;
  const get = options.node || identity;
  const before = options.before == null ? null : get(options.before, 0);

  const currentLength = currentNodes.length;
  let currentEnd = currentLength;
  let currentStart = 0;

  let futureEnd = futureNodes.length;
  let futureStart = 0;

  // common prefix
  while (
    currentStart < currentEnd &&
    futureStart < futureEnd &&
    compare(currentNodes[currentStart], futureNodes[futureStart])
  ) {
    currentStart++;
    futureStart++;
  }

  // common suffix
  while (
    currentStart < currentEnd &&
    futureStart < futureEnd &&
    compare(currentNodes[currentEnd - 1], futureNodes[futureEnd - 1])
  ) {
    currentEnd--;
    futureEnd--;
  }

  const currentSame = currentStart === currentEnd;
  const futureSame = futureStart === futureEnd;

  // same list
  if (currentSame && futureSame)
    return futureNodes;

  // only stuff to add
  if (currentSame && futureStart < futureEnd) {
    append(
      get,
      parentNode,
      futureNodes,
      futureStart,
      futureEnd,
      next(get, currentNodes, currentStart, currentLength, before)
    );
    return futureNodes;
  }

  // only stuff to remove
  if (futureSame && currentStart < currentEnd) {
    remove(
      get,
      currentNodes,
      currentStart,
      currentEnd
    );
    return futureNodes;
  }

  const currentChanges = currentEnd - currentStart;
  const futureChanges = futureEnd - futureStart;
  let i = -1;

  // 2 simple indels: the shortest sequence is a subsequence of the longest
  if (currentChanges < futureChanges) {
    i = indexOf(
      futureNodes,
      futureStart,
      futureEnd,
      currentNodes,
      currentStart,
      currentEnd,
      compare
    );
    // inner diff
    if (-1 < i) {
      append(
        get,
        parentNode,
        futureNodes,
        futureStart,
        i,
        get(currentNodes[currentStart], 0)
      );
      append(
        get,
        parentNode,
        futureNodes,
        i + currentChanges,
        futureEnd,
        next(get, currentNodes, currentEnd, currentLength, before)
      );
      return futureNodes;
    }
  }
  /* istanbul ignore else */
  else if (futureChanges < currentChanges) {
    i = indexOf(
      currentNodes,
      currentStart,
      currentEnd,
      futureNodes,
      futureStart,
      futureEnd,
      compare
    );
    // outer diff
    if (-1 < i) {
      remove(
        get,
        currentNodes,
        currentStart,
        i
      );
      remove(
        get,
        currentNodes,
        i + futureChanges,
        currentEnd
      );
      return futureNodes;
    }
  }

  // common case with one replacement for many nodes
  // or many nodes replaced for a single one
  /* istanbul ignore else */
  if ((currentChanges < 2 || futureChanges < 2)) {
    append(
      get,
      parentNode,
      futureNodes,
      futureStart,
      futureEnd,
      get(currentNodes[currentStart], 0)
    );
    remove(
      get,
      currentNodes,
      currentStart,
      currentEnd
    );
    return futureNodes;
  }

  // the half match diff part has been skipped in petit-dom
  // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L391-L397
  // accordingly, I think it's safe to skip in here too
  // if one day it'll come out like the speediest thing ever to do
  // then I might add it in here too

  // Extra: before going too fancy, what about reversed lists ?
  //        This should bail out pretty quickly if that's not the case.
  if (
    currentChanges === futureChanges &&
    isReversed(
      futureNodes,
      futureEnd,
      currentNodes,
      currentStart,
      currentEnd,
      compare
    )
  ) {
    append(
      get,
      parentNode,
      futureNodes,
      futureStart,
      futureEnd,
      next(get, currentNodes, currentEnd, currentLength, before)
    );
    return futureNodes;
  }

  // last resort through a smart diff
  smartDiff(
    get,
    parentNode,
    futureNodes,
    futureStart,
    futureEnd,
    futureChanges,
    currentNodes,
    currentStart,
    currentEnd,
    currentChanges,
    currentLength,
    compare,
    before
  );

  return futureNodes;
};

/*! (c) Andrea Giammarchi - ISC */
var importNode = (function (
  document,
  appendChild,
  cloneNode,
  createTextNode,
  importNode
) {
  var native = importNode in document;
  // IE 11 has problems with cloning templates:
  // it "forgets" empty childNodes. This feature-detects that.
  var fragment = document.createDocumentFragment();
  fragment[appendChild](document[createTextNode]('g'));
  fragment[appendChild](document[createTextNode](''));
  var content = native ?
    document[importNode](fragment, true) :
    fragment[cloneNode](true);
  return content.childNodes.length < 2 ?
    function importNode(node, deep) {
      var clone = node[cloneNode]();
      for (var
        childNodes = node.childNodes || [],
        length = childNodes.length,
        i = 0; deep && i < length; i++
      ) {
        clone[appendChild](importNode(childNodes[i], deep));
      }
      return clone;
    } :
    (native ?
      document[importNode] :
      function (node, deep) {
        return node[cloneNode](!!deep);
      }
    );
}(
  document,
  'appendChild',
  'cloneNode',
  'createTextNode',
  'importNode'
));

var trim = ''.trim || function () {
  return String(this).replace(/^\s+|\s+/g, '');
};

function find(node, path) {
  var length = path.length;
  var i = 0;
  while (i < length)
    node = node.childNodes[path[i++]];
  return node;
}

function parse(node, holes, parts, path) {
  var childNodes = node.childNodes;
  var length = childNodes.length;
  var i = 0;
  while (i < length) {
    var child = childNodes[i];
    switch (child.nodeType) {
      case ELEMENT_NODE:
        var childPath = path.concat(i);
        parseAttributes(child, holes, parts, childPath);
        parse(child, holes, parts, childPath);
        break;
      case COMMENT_NODE:
        var textContent = child.textContent;
        if (textContent === UID) {
          parts.shift();
          holes.push(
            // basicHTML or other non standard engines
            // might end up having comments in nodes
            // where they shouldn't, hence this check.
            SHOULD_USE_TEXT_CONTENT.test(node.nodeName) ?
              Text(node, path) :
              Any(child, path.concat(i))
          );
        } else {
          switch (textContent.slice(0, 2)) {
            case '/*':
              if (textContent.slice(-2) !== '*/')
                break;
            case '\uD83D\uDC7B': // ghost
              node.removeChild(child);
              i--;
              length--;
          }
        }
        break;
      case TEXT_NODE:
        // the following ignore is actually covered by browsers
        // only basicHTML ends up on previous COMMENT_NODE case
        // instead of TEXT_NODE because it knows nothing about
        // special style or textarea behavior
        /* istanbul ignore if */
        if (
          SHOULD_USE_TEXT_CONTENT.test(node.nodeName) &&
          trim.call(child.textContent) === UIDC
        ) {
          parts.shift();
          holes.push(Text(node, path));
        }
        break;
    }
    i++;
  }
}

function parseAttributes(node, holes, parts, path) {
  var cache = new Map$1;
  var attributes = node.attributes;
  var remove = [];
  var html = parts.join(''); var array = remove.slice.call(attributes, 0).sort(function(left, right) { return html.indexOf(left.name) <= html.indexOf(right.name) ? -1 : 1; });
  var length = array.length;
  var i = 0;
  while (i < length) {
    var attribute = array[i++];
    var direct = attribute.value === UID;
    var sparse;
    if (direct || 1 < (sparse = attribute.value.split(UIDC)).length) {
      var name = attribute.name;
      // the following ignore is covered by IE
      // and the IE9 double viewBox test
      /* istanbul ignore else */
      if (!cache.has(name)) {
        var realName = parts.shift().replace(
          direct ?
            /^(?:|[\S\s]*?\s)(\S+?)\s*=\s*('|")?$/ :
            // TODO: while working on yet another IE/Edge bug I've realized
            //        the current not direct logic easily breaks there
            //        because the `name` might not be the real needed one.
            //        Use a better RegExp to find last attribute instead
            //        of trusting `name` is what we are looking for.
            //        Thanks IE/Edge, I hate you both.
            new RegExp(
              '^(?:|[\\S\\s]*?\\s)(' + name + ')\\s*=\\s*(\'|")[\\S\\s]*',
              'i'
            ),
            '$1'
        );
        var value = attributes[realName] ||
                      // the following ignore is covered by browsers
                      // while basicHTML is already case-sensitive
                      /* istanbul ignore next */
                      attributes[realName.toLowerCase()];
        cache.set(name, value);
        if (direct)
          holes.push(Attr(value, path, realName, null));
        else {
          var skip = sparse.length - 2;
          while (skip--)
            parts.shift();
          holes.push(Attr(value, path, realName, sparse));
        }
      }
      remove.push(attribute);
    }
  }
  length = remove.length;
  i = 0;

  /* istanbul ignore next */
  var cleanValue = 0 < length && UID_IE && !('ownerSVGElement' in node);
  while (i < length) {
    // Edge HTML bug #16878726
    var attr = remove[i++];
    // IE/Edge bug lighterhtml#63 - clean the value or it'll persist
    /* istanbul ignore next */
    if (cleanValue)
      attr.value = '';
    // IE/Edge bug lighterhtml#64 - don't use removeAttributeNode
    node.removeAttribute(attr.name);
  }

  // This is a very specific Firefox/Safari issue
  // but since it should be a not so common pattern,
  // it's probably worth patching regardless.
  // Basically, scripts created through strings are death.
  // You need to create fresh new scripts instead.
  // TODO: is there any other node that needs such nonsense?
  var nodeName = node.nodeName;
  if (/^script$/i.test(nodeName)) {
    // this used to be like that
    // var script = createElement(node, nodeName);
    // then Edge arrived and decided that scripts created
    // through template documents aren't worth executing
    // so it became this ... hopefully it won't hurt in the wild
    var script = document.createElement(nodeName);
    length = attributes.length;
    i = 0;
    while (i < length)
      script.setAttributeNode(attributes[i++].cloneNode(true));
    script.textContent = node.textContent;
    node.parentNode.replaceChild(script, node);
  }
}

function Any(node, path) {
  return {
    type: 'any',
    node: node,
    path: path
  };
}

function Attr(node, path, name, sparse) {
  return {
    type: 'attr',
    node: node,
    path: path,
    name: name,
    sparse: sparse
  };
}

function Text(node, path) {
  return {
    type: 'text',
    node: node,
    path: path
  };
}

// globals

var parsed = new WeakMap$1;
var referenced = new WeakMap$1;

function createInfo(options, template) {
  var markup = (options.convert || domsanitizer)(template);
  var transform = options.transform;
  if (transform)
    markup = transform(markup);
  var content = createContent(markup, options.type);
  cleanContent(content);
  var holes = [];
  parse(content, holes, template.slice(0), []);
  var info = {
    content: content,
    updates: function (content) {
      var updates = [];
      var len = holes.length;
      var i = 0;
      var off = 0;
      while (i < len) {
        var info = holes[i++];
        var node = find(content, info.path);
        switch (info.type) {
          case 'any':
            updates.push({fn: options.any(node, []), sparse: false});
            break;
          case 'attr':
            var sparse = info.sparse;
            var fn = options.attribute(node, info.name, info.node);
            if (sparse === null)
              updates.push({fn: fn, sparse: false});
            else {
              off += sparse.length - 2;
              updates.push({fn: fn, sparse: true, values: sparse});
            }
            break;
          case 'text':
            updates.push({fn: options.text(node), sparse: false});
            node.textContent = '';
            break;
        }
      }
      len += off;
      return function () {
        var length = arguments.length;
        if (len !== (length - 1)) {
          throw new Error(
            (length - 1) + ' values instead of ' + len + '\n' +
            template.join('${value}')
          );
        }
        var i = 1;
        var off = 1;
        while (i < length) {
          var update = updates[i - off];
          if (update.sparse) {
            var values = update.values;
            var value = values[0];
            var j = 1;
            var l = values.length;
            off += l - 2;
            while (j < l)
              value += arguments[i++] + values[j++];
            update.fn(value);
          }
          else
            update.fn(arguments[i++]);
        }
        return content;
      };
    }
  };
  parsed.set(template, info);
  return info;
}

function createDetails(options, template) {
  var info = parsed.get(template) || createInfo(options, template);
  var content = importNode.call(document, info.content, true);
  var details = {
    content: content,
    template: template,
    updates: info.updates(content)
  };
  referenced.set(options, details);
  return details;
}

function domtagger(options) {
  return function (template) {
    var details = referenced.get(options);
    if (details == null || details.template !== template)
      details = createDetails(options, template);
    details.updates.apply(null, arguments);
    return details.content;
  };
}

function cleanContent(fragment) {
  var childNodes = fragment.childNodes;
  var i = childNodes.length;
  while (i--) {
    var child = childNodes[i];
    if (
      child.nodeType !== 1 &&
      trim.call(child.textContent).length === 0
    ) {
      fragment.removeChild(child);
    }
  }
}

/*! (c) Andrea Giammarchi - ISC */
var hyperStyle = (function (){  // from https://github.com/developit/preact/blob/33fc697ac11762a1cb6e71e9847670d047af7ce5/src/varants.js
  var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
  var hyphen = /([^A-Z])([A-Z]+)/g;
  return function hyperStyle(node, original) {
    return 'ownerSVGElement' in node ? svg(node, original) : update(node.style, false);
  };
  function ized($0, $1, $2) {
    return $1 + '-' + $2.toLowerCase();
  }
  function svg(node, original) {
    var style;
    if (original)
      style = original.cloneNode(true);
    else {
      node.setAttribute('style', '--hyper:style;');
      style = node.getAttributeNode('style');
    }
    style.value = '';
    node.setAttributeNode(style);
    return update(style, true);
  }
  function toStyle(object) {
    var key, css = [];
    for (key in object)
      css.push(key.replace(hyphen, ized), ':', object[key], ';');
    return css.join('');
  }
  function update(style, isSVG) {
    var oldType, oldValue;
    return function (newValue) {
      var info, key, styleValue, value;
      switch (typeof newValue) {
        case 'object':
          if (newValue) {
            if (oldType === 'object') {
              if (!isSVG) {
                if (oldValue !== newValue) {
                  for (key in oldValue) {
                    if (!(key in newValue)) {
                      style[key] = '';
                    }
                  }
                }
              }
            } else {
              if (isSVG)
                style.value = '';
              else
                style.cssText = '';
            }
            info = isSVG ? {} : style;
            for (key in newValue) {
              value = newValue[key];
              styleValue = typeof value === 'number' &&
                                  !IS_NON_DIMENSIONAL.test(key) ?
                                  (value + 'px') : value;
              if (!isSVG && /^--/.test(key))
                info.setProperty(key, styleValue);
              else
                info[key] = styleValue;
            }
            oldType = 'object';
            if (isSVG)
              style.value = toStyle((oldValue = info));
            else
              oldValue = newValue;
            break;
          }
        default:
          if (oldValue != newValue) {
            oldType = 'string';
            oldValue = newValue;
            if (isSVG)
              style.value = newValue || '';
            else
              style.cssText = newValue || '';
          }
          break;
      }
    };
  }
}());

/*! (c) Andrea Giammarchi - ISC */
var Wire = (function (slice, proto) {

  proto = Wire.prototype;

  proto.ELEMENT_NODE = 1;
  proto.nodeType = 111;

  proto.remove = function (keepFirst) {
    var childNodes = this.childNodes;
    var first = this.firstChild;
    var last = this.lastChild;
    this._ = null;
    if (keepFirst && childNodes.length === 2) {
      last.parentNode.removeChild(last);
    } else {
      var range = this.ownerDocument.createRange();
      range.setStartBefore(keepFirst ? childNodes[1] : first);
      range.setEndAfter(last);
      range.deleteContents();
    }
    return first;
  };

  proto.valueOf = function (forceAppend) {
    var fragment = this._;
    var noFragment = fragment == null;
    if (noFragment)
      fragment = (this._ = this.ownerDocument.createDocumentFragment());
    if (noFragment || forceAppend) {
      for (var n = this.childNodes, i = 0, l = n.length; i < l; i++)
        fragment.appendChild(n[i]);
    }
    return fragment;
  };

  return Wire;

  function Wire(childNodes) {
    var nodes = (this.childNodes = slice.call(childNodes, 0));
    this.firstChild = nodes[0];
    this.lastChild = nodes[nodes.length - 1];
    this.ownerDocument = nodes[0].ownerDocument;
    this._ = null;
  }

}([].slice));

const {isArray} = Array;
const {create, freeze, keys} = Object;
const wireType = Wire.prototype.nodeType;

const OWNER_SVG_ELEMENT = 'ownerSVGElement';

// returns nodes from wires and components
const asNode = (item, i) => item.nodeType === wireType ?
  (
    (1 / i) < 0 ?
      (i ? item.remove(true) : item.lastChild) :
      (i ? item.valueOf(true) : item.firstChild)
  ) :
  item
;

// returns true if domdiff can handle the value
const canDiff = value => 'ELEMENT_NODE' in value;

// generic attributes helpers
const hyperAttribute = (node, original) => {
  let oldValue;
  let owner = false;
  const attribute = original.cloneNode(true);
  return newValue => {
    if (oldValue !== newValue) {
      oldValue = newValue;
      if (attribute.value !== newValue) {
        if (newValue == null) {
          if (owner) {
            owner = false;
            node.removeAttributeNode(attribute);
          }
          attribute.value = newValue;
        } else {
          attribute.value = newValue;
          if (!owner) {
            owner = true;
            node.setAttributeNode(attribute);
          }
        }
      }
    }
  };
};

// events attributes helpers
const hyperEvent = (node, name) => {
  let oldValue;
  let type = name.slice(2);
  if (name.toLowerCase() in node)
    type = type.toLowerCase();
  return newValue => {
    if (oldValue !== newValue) {
      if (oldValue)
        node.removeEventListener(type, oldValue, false);
      oldValue = newValue;
      if (newValue)
        node.addEventListener(type, newValue, false);
    }
  };
};

// special attributes helpers
const hyperProperty = (node, name) => {
  let oldValue;
  return newValue => {
    if (oldValue !== newValue) {
      oldValue = newValue;
      if (node[name] !== newValue) {
        if (newValue == null) {
          // cleanup before dropping the attribute to fix IE/Edge gotcha
          node[name] = '';
          node.removeAttribute(name);
        } else
          node[name] = newValue;
      }
    }
  };
};

// special hooks helpers
const hyperRef = node => {
  return ref => {
    ref.current = node;
  };
};

const hyperSetter = (node, name, svg) => svg ?
  value => {
    try {
      node[name] = value;
    }
    catch (nope) {
      node.setAttribute(name, value);
    }
  } :
  value => {
    node[name] = value;
  };

// list of attributes that should not be directly assigned
const readOnly = /^(?:form|list)$/i;

// reused every slice time
const slice = [].slice;

// simplifies text node creation
const text = (node, text) => node.ownerDocument.createTextNode(text);

function Tagger(type) {
  this.type = type;
  return domtagger(this);
}
Tagger.prototype = {

  // there are four kind of attributes, and related behavior:
  //  * events, with a name starting with `on`, to add/remove event listeners
  //  * special, with a name present in their inherited prototype, accessed directly
  //  * regular, accessed through get/setAttribute standard DOM methods
  //  * style, the only regular attribute that also accepts an object as value
  //    so that you can style=${{width: 120}}. In this case, the behavior has been
  //    fully inspired by Preact library and its simplicity.
  attribute(node, name, original) {
    switch (name) {
      case 'class':
        if (OWNER_SVG_ELEMENT in node)
          return hyperAttribute(node, original);
        name = 'className';
      case 'data':
      case 'props':
        return hyperProperty(node, name);
      case 'style':
        return hyperStyle(node, original, OWNER_SVG_ELEMENT in node);
      case 'ref':
        return hyperRef(node);
      default:
        if (name.slice(0, 1) === '.')
          return hyperSetter(node, name.slice(1), OWNER_SVG_ELEMENT in node);
        if (name.slice(0, 2) === 'on')
          return hyperEvent(node, name);
        if (name in node && !(
          OWNER_SVG_ELEMENT in node || readOnly.test(name)
        ))
          return hyperProperty(node, name);
        return hyperAttribute(node, original);

    }
  },

  // in a hyper(node)`<div>${content}</div>` case
  // everything could happen:
  //  * it's a JS primitive, stored as text
  //  * it's null or undefined, the node should be cleaned
  //  * it's a promise, update the content once resolved
  //  * it's an explicit intent, perform the desired operation
  //  * it's an Array, resolve all values if Promises and/or
  //    update the node with the resulting list of content
  any(node, childNodes) {
    const diffOptions = {node: asNode, before: node};
    const nodeType = OWNER_SVG_ELEMENT in node ? /* istanbul ignore next */ 'svg' : 'html';
    let fastPath = false;
    let oldValue;
    const anyContent = value => {
      switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
          if (fastPath) {
            if (oldValue !== value) {
              oldValue = value;
              childNodes[0].textContent = value;
            }
          } else {
            fastPath = true;
            oldValue = value;
            childNodes = domdiff(
              node.parentNode,
              childNodes,
              [text(node, value)],
              diffOptions
            );
          }
          break;
        case 'function':
          anyContent(value(node));
          break;
        case 'object':
        case 'undefined':
          if (value == null) {
            fastPath = false;
            childNodes = domdiff(
              node.parentNode,
              childNodes,
              [],
              diffOptions
            );
            break;
          }
        default:
          fastPath = false;
          oldValue = value;
          if (isArray(value)) {
            if (value.length === 0) {
              if (childNodes.length) {
                childNodes = domdiff(
                  node.parentNode,
                  childNodes,
                  [],
                  diffOptions
                );
              }
            } else {
              switch (typeof value[0]) {
                case 'string':
                case 'number':
                case 'boolean':
                  anyContent(String(value));
                  break;
                case 'function':
                  anyContent(value.map(invoke, node));
                  break;
                case 'object':
                  if (isArray(value[0])) {
                    value = value.concat.apply([], value);
                  }
                default:
                  childNodes = domdiff(
                    node.parentNode,
                    childNodes,
                    value,
                    diffOptions
                  );
                  break;
              }
            }
          } else if (canDiff(value)) {
            childNodes = domdiff(
              node.parentNode,
              childNodes,
              value.nodeType === 11 ?
                slice.call(value.childNodes) :
                [value],
              diffOptions
            );
          } else if ('text' in value) {
            anyContent(String(value.text));
          } else if ('any' in value) {
            anyContent(value.any);
          } else if ('html' in value) {
            childNodes = domdiff(
              node.parentNode,
              childNodes,
              slice.call(
                createContent(
                  [].concat(value.html).join(''),
                  nodeType
                ).childNodes
              ),
              diffOptions
            );
          } else if ('length' in value) {
            anyContent(slice.call(value));
          }
          break;
      }
    };
    return anyContent;
  },

  // style or textareas don't accept HTML as content
  // it's pointless to transform or analyze anything
  // different from text there but it's worth checking
  // for possible defined intents.
  text(node) {
    let oldValue;
    const textContent = value => {
      if (oldValue !== value) {
        oldValue = value;
        const type = typeof value;
        if (type === 'object' && value) {
          if ('text' in value) {
            textContent(String(value.text));
          } else if ('any' in value) {
            textContent(value.any);
          } else if ('html' in value) {
            textContent([].concat(value.html).join(''));
          } else if ('length' in value) {
            textContent(slice.call(value).join(''));
          }
        } else if (type === 'function') {
          textContent(value(node));
        } else {
          node.textContent = value == null ? '' : value;
        }
      }
    };
    return textContent;
  }
};

function invoke(callback) {
  return callback(this);
}

const cache = new WeakMap$1;

const createRender = Tagger => ({
  html: outer('html', Tagger),
  svg: outer('svg', Tagger),
  render(where, what) {
    const hole = typeof what === 'function' ? what() : what;
    const info = cache.get(where) || setCache(where);
    const wire = hole instanceof Hole ? retrieve(Tagger, info, hole) : hole;
    if (wire !== info.wire) {
      info.wire = wire;
      where.textContent = '';
      where.appendChild(wire.valueOf(true));
    }
    return where;
  }
});

const newInfo = () => ({sub: [], stack: [], wire: null});

const outer = (type, Tagger) => {
  const cache = new WeakMap$1;
  const fixed = info => function () {
    return retrieve(Tagger, info, hole.apply(null, arguments));
  };
  const set = ref => {
    const memo = create(null);
    cache.set(ref, memo);
    return memo;
  };
  hole.for = (ref, id) => {
    const memo = cache.get(ref) || set(ref);
    return memo[id] || (memo[id] = fixed(newInfo()));
  };
  hole.node = function () {
    return retrieve(Tagger, newInfo(), hole.apply(null, arguments)).valueOf(true);
  };
  return hole;
  function hole() {
    return new Hole(type, tta.apply(null, arguments));
  }
};

const retrieve = (Tagger, info, hole) => {
  const {sub, stack} = info;
  const counter = {
    a: 0, aLength: sub.length,
    i: 0, iLength: stack.length
  };
  const wire = unroll(Tagger, info, hole, counter);
  const {a, i, aLength, iLength} = counter;
  if ((a + 1) < aLength)
    sub.splice(a + 1);
  if ((i + 1) < iLength)
    stack.splice(i + 1);
  return wire;
};

const setCache = where => {
  const info = newInfo();
  cache.set(where, info);
  return info;
};

const unroll = (Tagger, info, hole, counter) => {
  const {stack} = info;
  const {i, iLength} = counter;
  const {type, args} = hole;
  if (i === iLength)
    counter.iLength = stack.push({
      type,
      id: args[0],
      tag: null,
      wire: null
    });
  unrollArray(Tagger, info, args, counter);
  const entry = stack[i];
  if (i < iLength && entry.id === args[0] && entry.type === type)
    entry.tag.apply(null, args);
  else {
    entry.type = type;
    entry.id = args[0];
    entry.tag = new Tagger(type);
    entry.wire = wiredContent(entry.tag.apply(null, args));
  }
  return entry.wire;
};

const unrollArray = (Tagger, info, args, counter) => {
  for (let i = 1, {length} = args; i < length; i++) {
    const hole = args[i];
    if (typeof hole === 'object' && hole) {
      if (hole instanceof Hole) {
        counter.i++;
        args[i] = unroll(Tagger, info, hole, counter);
      }
      else if (isArray(hole)) {
        for (let i = 0, {length} = hole; i < length; i++) {
          const inner = hole[i];
          if (typeof inner === 'object' && inner && inner instanceof Hole) {
            const {sub} = info;
            const {a, aLength} = counter;
            if (a === aLength)
              counter.aLength = sub.push(newInfo());
            counter.a++;
            hole[i] = retrieve(Tagger, sub[a], inner);
          }
        }
      }
    }
  }
};

const wiredContent = node => {
  const childNodes = node.childNodes;
  const {length} = childNodes;
  return length === 1 ?
    childNodes[0] :
    (length ? new Wire(childNodes) : node);
};

freeze(Hole);
function Hole(type, args) {
  this.type = type;
  this.args = args;
}
const {render, html, svg} = createRender(Tagger);

// eslint-disable-next-line import/no-extraneous-dependencies
const createRender$1 = (context, originalRender, postFunction) => {
    const renderFunction = render
        .bind(context, context.shadowRoot || context, () => {
        let element = originalRender();
        if (context.styles) {
            element = context.html `
          ${element}
          ${context.createStyle(context.styles)}
        `;
        }
        setTimeout(postFunction);
        return element;
    });
    // eslint-disable-next-line no-underscore-dangle
    return () => (context.__created ? renderFunction() : null);
};
const createPartial = () => html;

const attributeChangedCallback = (context, name, previous, current) => {
    const attribute = context.constructor.attributes
        .filter((attr) => attributeName(attr) === name)[0];
    if (attribute) {
        const nameCamel = kebabToCamel(name);
        const currentValue = attributeValue(attribute, current);
        if (currentValue !== context.props[nameCamel]) {
            // eslint-disable-next-line no-underscore-dangle,no-param-reassign
            context.__currentProps = Object.assign(Object.assign({}, context.props), { [nameCamel]: currentValue });
            context.render();
        }
    }
};

const emit = (context, name, detail, singleEmit) => {
    if (!name) {
        throw Error('No event name defined. Please provide a name.');
    }
    return context.dispatchEvent(new CustomEvent(name, Object.assign({ bubbles: !singleEmit }, (detail !== undefined && { detail }))));
};

const createStyle = (styleContent) => html `
  <style>${typeof styleContent === 'string' ? styleContent : styleContent.toString()}</style>
`;

const emitRendered = (context, elements) => {
    // eslint-disable-next-line no-underscore-dangle
    if (!elements.length || !elements.some((element) => !element.__rendered)) {
        // eslint-disable-next-line no-underscore-dangle,no-param-reassign
        context.__rendered = true;
        context.emit('rendered', undefined, true);
    }
    else {
        setTimeout(() => emitRendered(context, elements));
    }
};
const rendered = (context) => {
    context.rendered();
    const elements = [...(context.shadowRoot || context).querySelectorAll('*')]
        // eslint-disable-next-line no-underscore-dangle
        .filter((element) => typeof element.__rendered === 'boolean');
    emitRendered(context, elements);
};
const render$1 = (context, renderFunction) => {
    // eslint-disable-next-line no-underscore-dangle,no-param-reassign
    context.__rendered = false;
    return renderFunction();
};

const TEMPLATE_START = '<%';
const TEMPLATE_END = '%>';
const TEMPLATE_LITERAL_START = '<${%';
const TEMPLATE_LITERAL_END = '%}$>';
const newArray = (length) => [...Array(length)];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const startsWith = (haystack, needles) => (Array.isArray(needles) ? needles : [needles]).filter((needle) => {
    const starter = needle.indexOf('end') === 0 || needle.indexOf('else') === 0
        ? needle.toString() : `${needle.toString()} `;
    return haystack.trim().toUpperCase().indexOf(starter.toUpperCase()) === 0;
})[0] || false;
const getValue = (value, context) => (
// eslint-disable-next-line no-new-func
new Function(`return ${value}`)).bind(context)();
const customTemplate = (content) => `${TEMPLATE_LITERAL_START}${content}${TEMPLATE_LITERAL_END}`;
const splitTemplate = (content, splitStart, splitEnd) => content
    .split(splitStart)
    .reduce(((accumulator, str) => ([
    ...accumulator,
    ...str.split(splitEnd),
])), []);
const es5ThisHtml = (content) => {
    const contentSplit = splitTemplate(content, TEMPLATE_LITERAL_START, TEMPLATE_LITERAL_END);
    const templates = contentSplit.filter((_, index) => index % 2 === 0);
    const args = contentSplit.filter((_, index) => index % 2 === 1);
    return `this.html(${JSON.stringify(templates)}${args.length ? ',' : ''}${args.toString()})`;
};
const templateHelpers = {
    /* eslint-disable no-param-reassign */
    if(index, levelStarts) {
        levelStarts.push({ line: index });
    },
    else(index, levelStarts) {
        levelStarts[levelStarts.length - 1].elseLine = index;
    },
    endIf(index, levelStarts, parsedTemplate) {
        const start = levelStarts.pop();
        const condition = parsedTemplate[start.line].trim().split('if').slice(1).join('if');
        const content = parsedTemplate.slice(start.line + 1, start.elseLine !== undefined ? start.elseLine : index).join('');
        const contentFalse = start.elseLine !== undefined
            ? es5ThisHtml(parsedTemplate.slice(start.elseLine + 1, index - 2).join(''))
            : null;
        parsedTemplate[start.line] = customTemplate(`${condition} ? ${es5ThisHtml(content)} : ${contentFalse}`);
        newArray(index - start.line).forEach((_, line) => {
            parsedTemplate[start.line + 1 + line] = '';
        });
    },
    for(index, levelStarts) {
        levelStarts.push({ line: index });
    },
    endFor(index, levelStarts, parsedTemplate) {
        const start = levelStarts.pop();
        const [, item, , ...arraySplit] = parsedTemplate[start.line].trim().split(' ');
        const content = parsedTemplate.slice(start.line + 1, index).join('');
        parsedTemplate[start.line] = customTemplate(`(${arraySplit.join(' ')}).map((function(${item}) { return ${es5ThisHtml(content)} }).bind(this))`);
        newArray(index - start.line).forEach((_, line) => {
            parsedTemplate[start.line + 1 + line] = '';
        });
    },
    log(index, _, parsedTemplate) {
        const [, ...valueSplit] = parsedTemplate[index].split('log');
        parsedTemplate[index] = customTemplate(`console.log(${valueSplit.join('log')})`);
    },
};
const templateToFunctionString = (template = '', splitStart = TEMPLATE_START, splitEnd = TEMPLATE_END) => {
    const levelStarts = [];
    // remove comments and parse strings from args
    const parsedTemplate = splitTemplate(template.replace(/<!--[\s\S]*?-->/g, ''), splitStart, splitEnd);
    // parse regular variables and values
    parsedTemplate
        .filter((_, index) => index % 2 === 1)
        .forEach((arg, index) => {
        if (!startsWith(arg, Object.keys(templateHelpers))) {
            parsedTemplate[index * 2] += customTemplate(arg.trim()); // append to string before "arg"
            parsedTemplate[index * 2 + 1] = ''; // remove current "arg" value
        }
    });
    // parse custom templating entries
    parsedTemplate
        .filter((_, index) => index % 2 === 1)
        .forEach((arg, index) => {
        const helper = startsWith(arg, Object.keys(templateHelpers));
        if (helper) {
            templateHelpers[helper](index * 2 + 1, levelStarts, parsedTemplate);
        }
    });
    return `function() { return ${es5ThisHtml(parsedTemplate.join(''))}; }`;
};
const renderTemplate = (context, template = '') => {
    if (typeof template === 'function') {
        return template.bind(context)();
    }
    return getValue(`(${template.indexOf('function') === 0 ? template : templateToFunctionString(template)}).bind(this)`, context)();
};

const createRef = () => ({
    current: null,
});
const createRefCallback = (getter) => ({
    get current() {
        return getter();
    },
});

// eslint-disable-next-line import/no-default-export
class Component extends HTMLElement {
    constructor(useShadow = true) {
        super();
        this.__created = false;
        this.__rendered = false;
        this.__attributeChangedCallbackStack = [];
        this.createStyle = createStyle;
        if (useShadow) {
            this.attachShadow({ mode: 'open' });
        }
        const originalRender = this.render.bind(this);
        this.render = createRender$1(
        /* eslint-disable @typescript-eslint/no-explicit-any */
        this, () => render$1(this, originalRender), () => rendered(this));
    }
    get props() {
        /* eslint-disable no-underscore-dangle */
        if (!this.__currentProps) {
            this.__currentProps = (this.defaultProps || {});
        }
        return this.__currentProps;
        /* eslint-enable no-underscore-dangle */
    }
    get state() {
        /* eslint-disable no-underscore-dangle */
        if (!this.__currentState) {
            this.__currentState = (this.defaultState || {});
        }
        return this.__currentState;
        /* eslint-enable no-underscore-dangle */
    }
    get html() {
        /* eslint-disable no-underscore-dangle */
        if (!this.__html) {
            this.__html = createPartial();
        }
        return this.__html;
        /* eslint-enable no-underscore-dangle */
    }
    static register(outputToConsole = false) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return register(this, outputToConsole);
    }
    /* istanbul ignore next */
    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
    connectedCallback() { }
    /* istanbul ignore next */
    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
    disconnectedCallback() { }
    attributeChangedCallback(name, previous, current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return attributeChangedCallback(this, name, previous, current);
    }
    render() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.template === undefined ? null : renderTemplate(this, this.template);
    }
    /* istanbul ignore next */
    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
    rendered() { }
    emit(name, detail, singleEmit = false) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return emit(this, name, detail, singleEmit);
    }
    setState(state) {
        // eslint-disable-next-line no-underscore-dangle
        this.__currentState = Object.assign(Object.assign({}, this.state), (typeof state === 'function' ? state.call(this, this.state) : state));
        this.render();
    }
}
Component.dependencies = [];
Component.attributes = [];

exports.createRef = createRef;
exports.createRefCallback = createRefCallback;
exports.createStyle = createStyle;
exports.default = Component;
exports.html = html;
exports.templateToFunctionString = templateToFunctionString;
exports.toArray = toArray;
exports.toBoolean = toBoolean;
exports.toFunction = toFunction;
exports.toNumber = toNumber;
exports.toObject = toObject;
exports.toString = toString;

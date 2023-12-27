import _ from 'lodash';

const convertArrInStr = (value) => {
  if (_.isObject(value) && !Array.isArray(value)) {
    const lines = Object
      .entries(value)
      .map(([key, val]) => {
        if (Array.isArray(val)) {
          return `${key}: [${convertArrInStr(val)}]`;
        }
        return `${key}: {${convertArrInStr(val)}}`;
      });
    return lines.join('');
  }
  const result = value.map((el) => {
    if (Array.isArray(el)) {
      return `[${convertArrInStr(el)}]`;
    }
    if (_.isObject(el)) {
      return `{${convertArrInStr(el)}}`;
    }
    return `${el}`;
  });
  return result.join(', ');
};

const stringify = (value, depth = 1) => {
  if (!_.isObject(value)) {
    return `${value}`;
  }
  if (Array.isArray(value)) {
    return `[${convertArrInStr(value)}]`;
  }
  const indentSize = depth + 1;
  const currentIndent = '  '.repeat(indentSize + 1);
  const bracketIndent = '  '.repeat(indentSize - 1);
  const lines = Object
    .entries(value)
    .map(([key, val]) => `${currentIndent}${key}: ${stringify(val, depth + 2)}`);
  return [
    '{',
    ...lines,
    `${bracketIndent}}`,
  ].join('\n');
};

const getIndentation = (depth, sign) => {
  const indentSize = depth;
  const currentIndent = '  '.repeat(indentSize);
  return `${currentIndent}${sign}`;
};

const mapping = {
  changed: (el, depth) => `${getIndentation(depth, '-')} ${el.keyName}: ${stringify(el.value1, depth + 1)}\n${getIndentation(depth, '+')} ${el.keyName}: ${stringify(el.value2, depth + 1)}`,
  nested: (el, depth) => `${getIndentation(depth, ' ')} ${el.keyName}: ${el.children.map((node) => `\n${mapping[node.status](node, depth + 2)}`)}`,
  equals: (el, depth) => `${getIndentation(depth, ' ')} ${el.keyName}: ${stringify(el.value, depth + 1)}`,
  minus: (el, depth) => `${getIndentation(depth, '-')} ${el.keyName}: ${stringify(el.value, depth + 1)}`,
  plus: (el, depth) => `${getIndentation(depth, '+')} ${el.keyName}: ${stringify(el.value, depth + 1)}`,
};

const stylish = (tree, depth = 1) => {
  if (tree.length === 0) {
    return '{}';
  }
  const lines = tree.map((el) => mapping[el.status](el, depth));
  return [
    '{',
    ...lines,
    `${'  '.repeat(depth - 1)}}`,
  ].join('\n');
};

export default stylish;

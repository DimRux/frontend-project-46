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

const getIndentation = (depth, sign, name, value) => {
  const indentSize = depth;
  const currentIndent = '  '.repeat(indentSize);
  return `${currentIndent}${sign} ${name}: ${stringify(value, depth + 1)}`;
};

const stylish = (tree, depth = 1) => {
  if (tree.length === 0) {
    return '{}';
  }
  const indentSize = depth;
  const currentIndent = '  '.repeat(indentSize);
  const mapping = {
    changed: (el) => `${getIndentation(depth, '-', el.keyName, el.value1)}\n${getIndentation(depth, '+', el.keyName, el.value2)}`,
    nested: (el) => `${currentIndent}  ${el.keyName}: ${stylish(el.children, depth + 2)}`,
    equals: (el) => getIndentation(depth, ' ', el.keyName, el.value),
    minus: (el) => getIndentation(depth, '-', el.keyName, el.value),
    plus: (el) => getIndentation(depth, '+', el.keyName, el.value),
  };
  const lines = tree.map((el) => mapping[el.status](el));
  return [
    '{',
    ...lines,
    `${'  '.repeat(depth - 1)}}`,
  ].join('\n');
};

export default stylish;

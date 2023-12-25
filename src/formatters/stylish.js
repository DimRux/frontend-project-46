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

const stringify = (value, replacer = '  ', nowDepth = 1, depth = 1, spacesCount = 1) => {
  if (!_.isObject(value)) {
    return `${value}`;
  }
  if (Array.isArray(value)) {
    return `[${convertArrInStr(value)}]`;
  }
  const indentSize = nowDepth + depth * spacesCount;
  const currentIndent = replacer.repeat(indentSize + 1);
  const bracketIndent = replacer.repeat(indentSize - spacesCount);
  const lines = Object
    .entries(value)
    .map(([key, val]) => `${currentIndent}${key}: ${stringify(val, replacer, nowDepth, depth + 2)}`);
  return [
    '{',
    ...lines,
    `${bracketIndent}}`,
  ].join('\n');
};

const stylish = (tree, depth = 1, replacer = '  ', spacesCount = 1) => {
  const indentSize = depth * spacesCount;
  const currentIndent = replacer.repeat(indentSize);
  const bracketIndent = replacer.repeat(indentSize - spacesCount);
  const mapping = {
    changed: (el) => `${currentIndent}- ${el.keyName}: ${stringify(el.value1, replacer, depth + 1)}\n${currentIndent}+ ${el.keyName}: ${stringify(el.value2, replacer, depth + 1)}`,
    nested: (el) => `${currentIndent}  ${el.keyName}: ${stylish(el.children, depth + 2)}`,
    equals: (el) => `${currentIndent}  ${el.keyName}: ${stringify(el.value, replacer, depth + 1)}`,
    minus: (el) => `${currentIndent}- ${el.keyName}: ${stringify(el.value, replacer, depth + 1)}`,
    plus: (el) => `${currentIndent}+ ${el.keyName}: ${stringify(el.value, replacer, depth + 1)}`,
  };
  const lines = tree.map((el) => mapping[el.status](el));
  if (lines.length === 0) {
    return '{}';
  }
  return [
    '{',
    ...lines,
    `${bracketIndent}}`,
  ].join('\n');
};

export default stylish;

import _ from 'lodash';

const stringify = (currentValue, replacer = '  ', nowDepth = 1, spacesCount = 1) => {
  const iter = (value, depth) => {
    if (!_.isObject(value)) {
      return `${value}`;
    }
    const indentSize = nowDepth + depth * spacesCount;
    const currentIndent = replacer.repeat(indentSize + 1);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);
    const lines = Object
      .entries(value)
      .map(([key, val]) => `${currentIndent}${key}: ${iter(val, depth + 2)}`);
    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };
  return iter(currentValue, 1);
};

const convertObjInStr = (indent, apmersand, key, value, replacer, depth) => `${indent}${apmersand} ${key}: ${stringify(value, replacer, depth + 1)}`;

const stylish = (tree, replacer = '  ', spacesCount = 1) => {
  const iter = (node, depth) => {
    const indentSize = depth * spacesCount;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);
    const mapping = {
      changed: (el) => `${convertObjInStr(currentIndent, '-', el.keyName, el.value1, replacer, depth)}\n${convertObjInStr(currentIndent, '+', el.keyName, el.value2, replacer, depth)}`,
      nested: (el) => `${currentIndent}  ${el.keyName}: ${iter(el.children, depth + 2)}`,
      equals: (el) => convertObjInStr(currentIndent, ' ', el.keyName, el.value, replacer, depth),
      minus: (el) => convertObjInStr(currentIndent, '-', el.keyName, el.value, replacer, depth),
      plus: (el) => convertObjInStr(currentIndent, '+', el.keyName, el.value, replacer, depth),
    };
    const lines = node.map((el) => mapping[el.status](el));
    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };
  return iter(tree, 1);
};

export default stylish;

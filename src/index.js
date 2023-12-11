import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parsers from './parsers.js';
import buildTree from './buildTree.js';

const readFile = (paths) => {
  const fullPath = path.resolve(process.cwd(), paths);
  const data = fs.readFileSync(fullPath).toString();
  return data;
};

const extName = (pies) => path.extname(pies).slice(1);

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

const genDiff = (filepath1, filepath2) => {
  const extName1 = extName(filepath1);
  const extName2 = extName(filepath2);

  const readFile1 = readFile(filepath1);
  const readFile2 = readFile(filepath2);

  const file1 = parsers(readFile1, extName1);
  const file2 = parsers(readFile2, extName2);

  const tree = buildTree(file1, file2);
  return stylish(tree);
};

export {
  readFile,
  extName,
  genDiff,
  stylish,
};

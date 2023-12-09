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

const formater = (tree, replacer = '  ', spacesCount = 1) => {
  const iter = (node, depth) => node.reduce((acc, el) => {
    let str;
    if (_.has(el, 'children')) {
      str = `${replacer.repeat(depth)}  ${el.keyName}: {${iter(el.children, depth + 1)}\n${replacer.repeat(depth)}}`;
    } else {
      if (el.status === 'equals') {
        str = `${replacer.repeat(depth)} ${el.keyName}:  ${el.value}`;
      }
      if (el.status === 'minus') {
        str = `${replacer.repeat(depth)}-${el.keyName}:  ${el.value}`;
      }
      if (el.status === 'plus') {
        str = `${replacer.repeat(depth)}+${el.keyName}:  ${el.value}`;
      }
    }
    return `${acc}\n${str}`;
  }, '');
  return iter(tree, spacesCount);
};

const genDiff = (filepath1, filepath2) => {
  const extName1 = extName(filepath1);
  const extName2 = extName(filepath2);

  const readFile1 = readFile(filepath1);
  const readFile2 = readFile(filepath2);

  const file1 = parsers(readFile1, extName1);
  const file2 = parsers(readFile2, extName2);

  const tree = buildTree(file1, file2);
  return formater(tree);
};

export {
  readFile,
  extName,
  genDiff,
};

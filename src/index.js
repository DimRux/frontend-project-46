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

const stringify = (value, nowReplacer = '  ', nowDepth = 1) => {
  if (!_.isObject(value)) {
    return ` ${value}`;
  }
  const iter = (obj, depth) => {
    const keys = Object.keys(obj).sort();
    return keys.reduce((acc, el) => {
      let str;
      if (_.isObject(obj[el])) {
        str = `${nowReplacer.repeat(depth + 3)}${el}: {${iter(obj[el], depth + 2)}\n${nowReplacer.repeat(depth + 3)}}`;
      } else {
        str = `${nowReplacer.repeat(depth + 3)}${el}: ${obj[el]}`;
      }
      return `${acc}\n${str}`;
    }, '');
  };
  return ` {${iter(value, nowDepth)}\n${nowReplacer.repeat(nowDepth + 1)}}`;
};

const formater = (tree, replacer = '  ', spacesCount = 1) => {
  const iter = (node, depth) => node.reduce((acc, el) => {
    let str;
    if (el.status === 'notChanged') {
      str = `${replacer.repeat(depth)}- ${el.keyName}:${stringify(el.value1, replacer, depth)}\n${replacer.repeat(depth)}+ ${el.keyName}:${stringify(el.value2, replacer, depth)}`;
    }
    if (el.status === 'nested') {
      str = `${replacer.repeat(depth)}  ${el.keyName}: {${iter(el.children, depth + 2)}\n${replacer.repeat(depth)}  }`;
    }
    if (el.status === 'equals') {
      str = `${replacer.repeat(depth)}  ${el.keyName}:${stringify(el.value, replacer, depth)}`;
    }
    if (el.status === 'minus') {
      str = `${replacer.repeat(depth)}- ${el.keyName}:${stringify(el.value, replacer, depth)}`;
    }
    if (el.status === 'plus') {
      str = `${replacer.repeat(depth)}+ ${el.keyName}:${stringify(el.value, replacer, depth)}`;
    }
    return `${acc}\n${str}`;
  }, '');
  return `{${iter(tree, spacesCount)}\n}`;
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

import fs from 'fs';
import path from 'path';
import parsers from './parsers.js';
import buildTree from './buildTree.js';
import formatters from '../formatters/formatters.index.js';

const readFile = (paths) => {
  const fullPath = path.resolve(process.cwd(), paths);
  const data = fs.readFileSync(fullPath, 'utf-8').toString();
  return data;
};

const extName = (pies) => path.extname(pies).slice(1);

const genDiff = (filepath1, filepath2, format) => {
  const extName1 = extName(filepath1);
  const extName2 = extName(filepath2);

  const readFile1 = readFile(filepath1);
  const readFile2 = readFile(filepath2);

  const file1 = parsers(readFile1, extName1);
  const file2 = parsers(readFile2, extName2);

  const tree = buildTree(file1, file2);
  return formatters(format)(tree);
};

export {
  readFile,
  extName,
  genDiff,
};

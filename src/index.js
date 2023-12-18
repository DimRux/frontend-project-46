import fs from 'fs';
import path from 'path';
import parsers from './parsers.js';
import buildTree from './buildTree.js';
import formatName from './formatters/index.js';

const readFile = (paths) => {
  const fullPath = path.resolve(process.cwd(), paths);
  const data = fs.readFileSync(fullPath, 'utf-8').toString();
  return data;
};

const fileExtension = (pathName) => path.extname(pathName).slice(1);

const genDiff = (pathToFile1, pathToFile2, format) => {
  const extName1 = fileExtension(pathToFile1);
  const extName2 = fileExtension(pathToFile2);

  const readFile1 = readFile(pathToFile1);
  const readFile2 = readFile(pathToFile2);

  const contentsOfFile1 = parsers(readFile1, extName1);
  const contentsOfFile2 = parsers(readFile2, extName2);

  const tree = buildTree(contentsOfFile1, contentsOfFile2);
  return formatName(tree, format);
};

export default genDiff;

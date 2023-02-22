import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const readFile = (paths) => {
  const fullPath = path.resolve(process.cwd(), paths);
  const data = fs.readFileSync(fullPath).toString();
  return data;
};

const extName = (pies) => {
  const fullPath = path.resolve(process.cwd(), pies);
  const parse = path.parse(fullPath);
  return parse.ext.slice(1);
};

const fileFormat = (data, format) => {
  if (format === 'json') {
    return JSON.parse(data);
  }
  return `Unknown format! ${format}`;
};

const genDiff = (filepath1, filepath2) => {
  const extName1 = extName(filepath1);
  const extName2 = extName(filepath2);

  const readFile1 = readFile(filepath1);
  const readFile2 = readFile(filepath2);

  const file1 = fileFormat(readFile1, extName1);
  const file2 = fileFormat(readFile2, extName2);

  const key1 = Object.keys(file1);
  const key2 = Object.keys(file2);
  const keys = _.sortBy(_.union(key1, key2));

  const result = keys.reduce((acc, key) => {
    let str = '';
    if (_.has(file1, key) && _.has(file2, key)) {
      if (file1[key] === file2[key]) {
        str = `  ${key}: ${file1[key]}\n`;
      } else {
        str = `- ${key}: ${file1[key]}\n+ ${key}: ${file2[key]}\n`;
      }
    } else if (_.has(file1, key) && !(_.has(file2, key))) {
      str = `- ${key}: ${file1[key]}\n`;
    } else {
      str = `+ ${key}: ${file2[key]}\n`;
    }
    return `${acc}${str}`;
  }, '');
  return `{\n${result}}`;
};

export {
  readFile,
  extName,
  fileFormat,
  genDiff,
};

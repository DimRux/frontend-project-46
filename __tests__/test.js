import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import genDiff from '../src/index.js';
import parsers from '../src/parsers.js';
import formatters from '../src/formatters/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '/__fixtures__/', filename);
const readFiles = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const file1 = './__fixtures__/file1.json';
const file2 = './__fixtures__/file2.json';
const file3 = './__fixtures__/file1.yaml';
const file4 = './__fixtures__/file2.yml';
const file5 = './__fixtures__/file3.json';
const file6 = './__fixtures__/file4.yml';
const file7 = './__fixtures__/file5.json';
const file8 = './__fixtures__/file6.json';

const genDiffFil1File3 = readFiles('stylishFileOutput.txt');
const genDiffFil2File4 = readFiles('plainFileOutput.txt');
const genDiffFil1File4 = readFiles('jsonFileOutput.txt');
const genDiffFil5File6 = readFiles('stylishOnArrayFileOutput.txt');
const genDiffFil7File8 = readFiles('stylishEmptyFileOutput.txt');
const genDiffFil7File8JSON = readFiles('jsonEmptyFileOutput.txt');

test('formatters Error', () => {
  expect(() => {
    formatters([], 'XML');
  }).toThrow();
});

test('parsers Error', () => {
  expect(() => {
    parsers(readFiles('file1.json').toString(), 'XML');
  }).toThrow();
});

test('сhecking on arrays', () => {
  expect(genDiff(file5, file6, 'stylish')).toEqual(genDiffFil5File6);
});

test('stylish format', () => {
  expect(genDiff(file1, file2, 'stylish')).toEqual(genDiffFil1File3);
  expect(genDiff(file7, file8, 'stylish')).toEqual(genDiffFil7File8);
});

test('plain format', () => {
  expect(genDiff(file3, file4, 'plain')).toEqual(genDiffFil2File4);
});

test('json format', () => {
  expect(genDiff(file1, file4, 'json')).toEqual(genDiffFil1File4);
  expect(genDiff(file7, file8, 'json')).toEqual(genDiffFil7File8JSON);
});

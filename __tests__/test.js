import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import { genDiff } from '../src/index.js';
import parsers from '../src/parsers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '../__fixtures__/', filename);
const readFiles = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const file1 = './__fixtures__/file1.json';
const file2 = './__fixtures__/file2.json';
const file3 = './__fixtures__/file1.yaml';
const file4 = './__fixtures__/file2.yml';

const genDiffFil1File3 = readFiles('stylishFileOutput.txt');
const genDiffFil2File4 = readFiles('plainFileOutput.txt');

test('parsers Error', () => {
  expect(() => {
    parsers(readFiles('file1.json').toString(), 'XML');
  }).toThrow();
});

test('stylish format', () => {
  expect(genDiff(file1, file2, 'stylish')).toEqual(genDiffFil1File3);
});

test('plain format', () => {
  expect(genDiff(file3, file4, 'plain')).toEqual(genDiffFil2File4);
});

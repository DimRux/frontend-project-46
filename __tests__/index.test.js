import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import { genDiff } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '../__fixtures__/', filename);
const readFiles = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const file1 = './__fixtures__/file1.json';
const file2 = './__fixtures__/file2.json';
const file3 = './__fixtures__/file1.yaml';
const file4 = './__fixtures__/file2.yml';

const genDiffFil1File2 = readFiles('fileOutput.txt');
const genDiffFil3File4 = readFiles('fileOutput.txt');

test('readFile', () => {
  expect(genDiff(file1, file2)).toEqual(genDiffFil1File2);
  expect(genDiff(file3, file4)).toEqual(genDiffFil3File4);
});

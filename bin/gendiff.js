#!/usr/bin/env node

import { Command } from 'commander';
import { genDiff } from '../src/index.js';

const program = new Command();

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.8.0')
  .option('-f, --format <type>', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2, options) => {
    const formatName = options.format;
    const diff = genDiff(filepath1, filepath2, formatName);
    console.log(diff);
  });

program.parse();

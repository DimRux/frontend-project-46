import plain from './plain.js';
import stylish from './stylish.js';
import json from './json.js';

export default (formatName, tree) => {
  if (formatName !== 'stylish' && formatName !== 'json' && formatName !== 'plain') {
    throw new Error(`Unknown formatName! ${formatName}`);
  }
  const correctsFormats = {
    plain: plain(tree),
    json: json(tree),
    stylish: stylish(tree),
  };
  return correctsFormats[formatName];
};

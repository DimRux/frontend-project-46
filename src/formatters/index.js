import plain from './plain.js';
import stylish from './stylish.js';
import json from './json.js';

export default (formatName, tree) => {
  if (formatName !== 'stylish' && formatName !== 'json' && formatName !== 'plain') {
    throw new Error(`Unknown formatName! ${formatName}`);
  }
  const correctsFormats = {
    plain: (node) => plain(node),
    json: (node) => json(node),
    stylish: (node) => stylish(node),
  };
  return correctsFormats[formatName](tree);
};

import plain from './plain.js';
import stylish from './stylish.js';
import json from './json.js';

export default (tree, formatName = 'stylish') => {
  const correctFormats = {
    plain: (node) => plain(node),
    json: (node) => json(node),
    stylish: (node) => stylish(node),
  };

  if (!correctFormats[formatName]) {
    throw new Error(`Unknown formatName! ${formatName}`);
  }

  return correctFormats[formatName](tree);
};

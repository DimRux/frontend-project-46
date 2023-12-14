import plain from './plain.js';
import stylish from './stylish.js';
import json from './json.js';

export default (formatName) => {
  if (formatName === 'stylish') {
    return stylish;
  }
  if (formatName === 'json') {
    return json;
  }
  return plain;
};

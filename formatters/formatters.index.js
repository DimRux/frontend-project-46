import plain from './plain.js';
import stylish from './stylish.js';

export default (formatName) => {
  if (formatName === 'stylish') {
    return stylish;
  }
  return plain;
};

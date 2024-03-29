import _ from 'lodash';

const getValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return `${value}`;
};

const fullPath = (path, partOfPath) => (path ? `${path}.${partOfPath}` : `${partOfPath}`);

const plain = (tree) => {
  const iter = (node, path) => {
    const mapping = {
      changed: (el) => `Property '${fullPath(path, el.keyName)}' was updated. From ${getValue(el.value1)} to ${getValue(el.value2)}\n`,
      nested: (el) => `${iter(el.children, fullPath(path, el.keyName))}\n`,
      minus: (el) => `Property '${fullPath(path, el.keyName)}' was removed\n`,
      plus: (el) => `Property '${fullPath(path, el.keyName)}' was added with value: ${getValue(el.value)}\n`,
    };
    const lines = node.map((el) => {
      if (Object.hasOwn(mapping, el.status)) {
        return mapping[el.status](el);
      }
      return null;
    });
    return lines.join('').trim();
  };
  return iter(tree, null);
};

export default plain;

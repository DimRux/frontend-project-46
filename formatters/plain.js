import _ from 'lodash';

const getValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (typeof (value) === 'string') {
    return `'${value}'`;
  }
  return value;
};

const fullPath = (path, pies) => (path ? `${path}.${pies}` : `${pies}`);

const plain = (tree) => {
  const iter = (node, path) => {
    const mapping = {
      changed: (el) => `Property '${fullPath(path, el.keyName)}' was updated. From ${getValue(el.value1)} to ${getValue(el.value2)}`,
      nested: (el) => iter(el.children, fullPath(path, el.keyName)),
      equals: (el) => el.nothing,
      minus: (el) => `Property '${fullPath(path, el.keyName)}' was removed`,
      plus: (el) => `Property '${fullPath(path, el.keyName)}' was added with value: ${getValue(el.value)}`,
    };
    const lines = node.map((el) => mapping[el.status](el));
    return lines.filter((el) => el !== undefined).join('\n');
  };
  return iter(tree, null);
};

export default plain;

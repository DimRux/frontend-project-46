import _ from 'lodash';

const normalize = (value) => {
  if (!_.isObject(value)) {
    return value;
  }
  const keys = Object.keys(value).sort();
  return keys.map((el) => {
    if (_.isObject(value[el])) {
      return { keyName: el, children: normalize(value[el]), status: 'equals' };
    }
    return { keyName: el, value: value[el], status: 'equals' };
  });
};

const buildTree = (data1, data2) => {
  const keysData1 = Object.keys(data1);
  const keysData2 = Object.keys(data2);
  const keys = _.union([...keysData1, ...keysData2]).sort();
  return keys.map((el) => {
    if (_.has(data1, el) && !_.has(data2, el)) {
      if (_.isObject(data1[el])) {
        return { keyName: el, children: normalize(data1[el]), status: 'minus' };
      }
      return { keyName: el, value: data1[el], status: 'minus' };
    }
    if (!_.has(data1, el) && _.has(data2, el)) {
      if (_.isObject(data2[el])) {
        return { keyName: el, children: normalize(data2[el]), status: 'plus' };
      }
      return { keyName: el, value: data2[el], status: 'plus' };
    }
    if (_.isObject(data1[el]) && _.isObject(data2[el])) {
      return { keyName: el, children: buildTree(data1[el], data2[el]), status: 'equals' };
    }
    if (data1[el] !== data2[el]) {
      return {
        keyName: el,
        value1: data1[el],
        value2: data2[el],
        status: 'equals',
      };
    }
    return { keyName: el, value: data1[el], status: 'equals' };
  });
};

export default buildTree;

import _ from 'lodash';

const buildTree = (data1, data2) => {
  const keysData1 = Object.keys(data1);
  const keysData2 = Object.keys(data2);
  const keys = _.sortBy(_.union(keysData1, keysData2));
  return keys.map((el) => {
    if (!_.has(data2, el)) {
      return { keyName: el, value: data1[el], status: 'minus' };
    }
    if (!_.has(data1, el)) {
      return { keyName: el, value: data2[el], status: 'plus' };
    }
    if (_.isObject(data1[el]) && _.isObject(data2[el])
    && !Array.isArray(data1[el]) && !Array.isArray(data1[el])) {
      return { keyName: el, children: buildTree(data1[el], data2[el]), status: 'nested' };
    }
    if (!_.isEqual(data1[el], data2[el])) {
      return {
        keyName: el,
        value1: data1[el],
        value2: data2[el],
        status: 'changed',
      };
    }
    return { keyName: el, value: data1[el], status: 'equals' };
  });
};

export default buildTree;

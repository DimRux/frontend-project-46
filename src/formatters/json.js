const json = (tree) => {
  if (tree.length === 0) {
    return '[{}]';
  }
  return JSON.stringify(tree);
};

export default json;

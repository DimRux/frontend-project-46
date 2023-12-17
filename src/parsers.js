import yaml from 'js-yaml';

const fileFormat = (data, format) => {
  if (format !== 'json' && format !== 'yaml' && format !== 'yml') {
    throw new Error(`Unknown format! ${format}`);
  }
  const correctsFormats = {
    json: (file) => JSON.parse(file),
    yaml: (file) => yaml.load(file),
    yml: (file) => yaml.load(file),
  };
  return correctsFormats[format](data);
};
export default fileFormat;

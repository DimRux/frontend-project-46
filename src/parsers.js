import yaml from 'js-yaml';

const fileFormat = (data, format) => {
  const correctFormats = {
    json: (file) => JSON.parse(file),
    yaml: (file) => yaml.load(file),
    yml: (file) => yaml.load(file),
  };

  if (!correctFormats[format]) {
    throw new Error(`Unknown format! ${format}`);
  }
  return correctFormats[format](data);
};
export default fileFormat;

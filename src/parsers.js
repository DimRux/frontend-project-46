import yaml from 'js-yaml';

const fileFormat = (data, format) => {
  if (format !== 'json' && format !== 'yaml' && format !== 'yml') {
    throw new Error(`Unknown format! ${format}`);
  }
  const correctsFormats = {
    json: JSON.parse(data),
    yaml: yaml.load(data),
    yml: yaml.load(data),
  };
  return correctsFormats[format];
};
export default fileFormat;

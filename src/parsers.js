import yaml from 'js-yaml';

const fileFormat = (data, format) => {
  if (format === 'json') {
    return JSON.parse(data);
  }
  if (format === 'yaml' || format === 'yml') {
    return yaml.load(data);
  }
  throw new Error(`Unknown format! ${format}`);
};
export default fileFormat;

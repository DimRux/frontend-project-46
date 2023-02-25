import yaml from 'js-yaml';

const fileFormat = (data, format) => {
  if (format === 'json') {
    return JSON.parse(data);
  }
  if (format === 'yaml' || format === 'yml') {
    return yaml.load(data);
  }
  return `Unknown format! ${format}`;
};
export default fileFormat;

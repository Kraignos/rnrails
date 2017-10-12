const _ = require('lodash');

const escapeName = (name, suffix) => {
  return _.endsWith(suffix) ? name.substring(0, name.length - suffix.length) : name;
}

const generateFileName = (name, suffix) => {
  let escapedName = escapeName(name, suffix);
  return `${_.kebabCase(escapedName).split('-').join('.')}.${suffix.toLowerCase()}`;
}

const importComponent = (component, name) => {
  return importFunction(component, name, 'components');
}

const importScreen = (component, name) => {
  return importFunction(component, name, 'screens');
}

const importFunction = (component, file, type) => {
  return `import ${component} from './${type}/${file}';`;
}

module.exports = {
  escapeName: escapeName,
  generateFileName: generateFileName,
  importComponent: importComponent,
  importScreen: importScreen,
};

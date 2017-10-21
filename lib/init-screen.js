const Promise = require('bluebird');
const fs = require('fs');
const utils = require('./utils');
const definitions = require('./definitions');
const readline = require('readline');
const LineByLineReader = require('line-by-line');
const esprima = require('esprima');
const escodegen = require('escodegen');

const suffix = 'Screen';

module.exports = {
  init: (name) => {
    return initScreen(name, options = {});
  },
}

let initScreen = (name, options) => {
  return new Promise((resolve, reject) => {
    let escapedName = utils.escapeName(name, suffix);
    let fileName = utils.generateFileName(name, suffix);
    let file = `./src/screens/${fileName}.js`;
    let componentName = `${escapedName}${suffix}`;
    let content = definitions.component.replace(/MyScreen/g, componentName).replace(/Escaped/g, escapedName);
    fs.writeFile(file, content, err => {
      if (err) reject(err);
      //fs.writeFileSync('./src/navigators/app.navigator.js', insertScreenDefinition(componentName, fileName));
      resolve();
    });
  });
}

const insertScreenDefinition = (componentName, fileName) => {
  const appFile = './src/navigators/app.navigator.js';
  let data = fs.readFileSync(appFile).toString();
  let definition = esprima.parseScript(`${componentName}: { screen: ${componentName} }`);
  const module = esprima.parseModule(data, { jsx: false, tolerant: true });
  const importStatement = utils.importScreen(componentName, fileName);
  const importTree = esprima.parseModule(importStatement);

  let lastImportPosition = -1;
  for (let i = 0; i < module.body.length; i++) {
    let n = module.body[i];
    if (n.type === 'ImportDeclaration') {
      lastImportPosition = i;
    }
    /*
    if (n.type === 'VariableDeclaration' && n.declarations) {
      let declaration = n.declarations[0];
      if (declaration.init.callee.name === 'StackNavigator') {
        module.body[i].declarations[0].init.arguments[0].properties.push(definition);
      }
    }
    */
  }
  module.body.splice(lastImportPosition, 0, importTree.body[0]);

  return escodegen.generate(module, {
    format: {
      indent: {
        style: '  ',
        json: true,
      },
      semicolons: false,
    }
  });
}

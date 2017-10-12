const Promise = require('bluebird');
const fs = require('fs');
const _ = require('lodash');
const utils = require('./utils');

const suffix = 'Component';
let component = `
import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class MyComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>MyComponent</Text>
      </View>
    );
  }
}`;

module.exports = {
  init: (name) => {
    return initComponent(name);
  }
}

let initComponent = (name) => {
  return new Promise((resolve, reject) => {
    let escapedName = utils.escapeName(name, suffix);
    let fileName = utils.generateFileName(name, suffix);
    let file = `./src/components/${fileName}.component.js`;
    let componentName = `${escapedName}${suffix}`;
    let content = component.replace('MyComponent', componentName).replace('MyComponent', componentName);
    fs.writeFile(file, content, err => {
      if (err) reject(err);
      resolve();
    });
  });
}

const spawn = require('child_process').spawn;
const Promise = require('bluebird');
const fs = require('fs');
const _ = require('lodash');
const esprima = require('esprima');
const definitions = require('./definitions');

const eslint =
`{
  "extends": "fbjs"
}`;

const eslintDeps = '--dev \
  eslint-config-fbjs \
  eslint-plugin-babel \
  eslint-plugin-flowtype \
  eslint-plugin-jsx-a11y \
  eslint-plugin-react \
  eslint-plugin-relay \
  eslint \
  babel-eslint';

module.exports = {
  init: (name) => {
    return initProject(name);
  },
  run: (options) => {
    return runProject(options);
  },
  configureEnvironment: (name) => {
    return configureEnvironment(name);
  },
  installDependencies: (name) => {
    return installDependencies(name);
  },
  installRedux: () => {
    return installReduxDependencies();
  },
  configureRedux: () => {
    return configureReduxProject();
  }
}

let initProject = (name, withNativeCode = false) => {
  return new Promise((resolve, reject) => {
    const cli = withNativeCode ? 'react-native init' : 'create-react-native-app';
    const cmd = `${cli} ${name}`;
    const cwd = process.cwd();
    const options = {
      encoding: 'utf8',
      timeout: 0,
      maxBuffer: 1024 * 1024 * 1024,
      killSignal: 'SIGTERM',
      cwd: cwd,
      env: null,
      stdio: 'pipe',
      detached: true,
    };
    let isWin = /^win/.test(process.platform);
    let child = spawn(isWin ? 'cmd' : 'sh', [isWin ? '/c':'-c', cmd], options);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.on('error', err => {
      reject(err);
    });
    child.on('exit', code => {
      const error = withNativeCode ? 'react-native init failed!' : 'create-react-native-app failed!';
      if (code != 0) return reject(new Error(error));
      resolve();
    });
  });
}

let runProject = (options) => {
  return new Promise((resolve, reject) => {
    const cmd = `react-native run-${options}`;
    const cwd = process.cwd();
    let isWin = /^win/.test(process.platform);
    let child = spawn(isWin ? 'cmd' : 'sh', [isWin ? '/c':'-c', cmd]);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.on('error', err => {
      reject(err);
    });
    child.on('exit', code => {
      if (code != 0) return reject(new Error(`react-native run ${options} failed!`));
      resolve();
    });
  });
}

let configureEnvironment = (name) => {
  return new Promise((resolve, reject) => {
    const cmd = `yarn add ${eslintDeps}`;
    const cwd = process.cwd();
    const options = {
      encoding: 'utf8',
      timeout: 0,
      maxBuffer: 1024 * 1024 * 1024,
      killSignal: 'SIGTERM',
      cwd: cwd,
      env: null,
      stdio: 'pipe',
    };
    let isWin = /^win/.test(process.platform);
    let child = spawn(isWin ? 'cmd' : 'sh', [isWin ? '/c':'-c', cmd], options);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.on('error', err => {
      reject(err);
    });
    child.on('exit', code => {
      if (code != 0) return reject(new Error('Installing dependencies failed!'));
      // So far so good, we generate the .eslintrc
      fs.writeFile('.eslintrc', eslint, err => {
        if (err) reject(err);
        resolve();
      });
    });
  });
}

let installDependencies = (name) => {
  return new Promise((resolve, reject) => {
    const cmd = 'yarn add react-navigation';
    const cwd = process.cwd();
    const options = {
      encoding: 'utf8',
      timeout: 0,
      maxBuffer: 1024 * 1024 * 1024,
      killSignal: 'SIGTERM',
      cwd: cwd,
      env: null,
      stdio: 'pipe',
    };
    let isWin = /^win/.test(process.platform);
    let child = spawn(isWin ? 'cmd' : 'sh', [isWin ? '/c':'-c', cmd], options);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.on('error', err => {
      reject(err);
    });
    child.on('exit', code => {
      if (code != 0) return reject(new Error('react-navigation installation failed!'));
      const fileName = 'app.js';
      let content = _.replace(definitions[fileName], 'YourAppName', name);
      fs.writeFile(`./src/${fileName}`, content, err => {
        if (err) reject(err);
        resolve();
      });
      resolve();
    });
  });
}

let installReduxDependencies = () => {
  return new Promise((resolve, reject) => {
    const cmd = 'yarn add redux react-redux';
    const cwd = process.cwd();
    const options = {
      encoding: 'utf8',
      timeout: 0,
      maxBuffer: 1024 * 1024 * 1024,
      killSignal: 'SIGTERM',
      cwd: cwd,
      env: null,
      stdio: 'pipe',
    };
    let isWin = /^win/.test(process.platform);
    let child = spawn(isWin ? 'cmd' : 'sh', [isWin ? '/c':'-c', cmd], options);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.on('error', err => {
      reject(err);
    });
    child.on('exit', code => {
      if (code != 0) return reject(new Error('redux installation failed!'));
      resolve();
    });
  });
}

let configureReduxProject = () => {
  return new Promise((resolve, reject) => {
    const packageJson = './package.json';
    let data = fs.readFileSync(packageJson).toString();
    const configuration = JSON.parse(data);
    const jestConfig = ["node_modules/(?!(jest-)?react-native|react-navigation)"];
    configuration.jest['transformIgnorePatterns'] = jestConfig;
    fs.writeFile(packageJson, JSON.stringify(configuration, null, 2), err => {
      if (err) reject(err);
      resolve();
    });
  });
}
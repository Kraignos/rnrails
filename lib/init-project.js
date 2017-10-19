const spawn = require('child_process').spawn;
const Promise = require('bluebird');
const fs = require('fs');
const _ = require('lodash');
const esprima = require('esprima');
const definitions = require('./definitions');
const utils = require('./utils');

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
  init: (name, withNativeCode) => {
    return initProject(name, withNativeCode);
  },
  run: (platform) => {
    return runProject(platform);
  },
  configureEnvironment: (name, withNativeCode) => {
    return configureEnvironment(name, withNativeCode);
  },
  installDependencies: (name, withNativeCode) => {
    return installDependencies(name, withNativeCode);
  },
  installRedux: () => {
    return installReduxDependencies();
  },
  configureRedux: () => {
    return configureReduxProject();
  },
  configureJest: () => {
    return configureJest();
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

let runProject = (platform = 'ios') => {
  return new Promise((resolve, reject) => {
    const config = '.rnrailsrc';
    let data = fs.readFileSync(config).toString();
    const configuration = JSON.parse(data);
    const cmd = configuration.withNativeCode ? `react-native run-${platform}` : `yarn start`;
    const cwd = process.cwd();
    let isWin = /^win/.test(process.platform);
    let child = spawn(isWin ? 'cmd' : 'sh', [isWin ? '/c':'-c', cmd]);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.on('error', err => {
      reject(err);
    });
    child.on('exit', code => {
      if (code != 0) return reject(new Error(`react-native run ${platform} failed!`));
      resolve();
    });
  });
}

let configureEnvironment = (name, withNativeCode = false) => {
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
        // We finally generate the .rnrailsrc
        const content = {
          name: name,
          withNativeCode: withNativeCode
        };
        fs.writeFile('.rnrailsrc', JSON.stringify(content, null, 2), err => {
          if (err) reject(err);
          resolve();
        });
      });
    });
  });
}

let installDependencies = (name, withNativeCode) => {
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
      const app = withNativeCode ? 'appNative' : 'appExpo';
      let content = _.replace(definitions[app], 'YourAppName', name);
      fs.writeFile(`./src/${fileName}`, content, err => {
        if (err) reject(err);
        if (!withNativeCode) {
          const rootApp =
          `import App from './src/app.js';
          export default App;`
          fs.writeFile(`./App.js`, rootApp, err => {
            if (err) reject(err);
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  });
}

let installReduxDependencies = () => {
  return new Promise((resolve, reject) => {
    const cmd = 'yarn add redux react-redux redux-logger';
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

let configureJest = () => {
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

let configureReduxProject = () => {
  return new Promise((resolve, reject) => {
    fs.mkdirSync('./src/navigators');
    fs.mkdirSync('./src/reducers');
    fs.writeFile('./src/navigators/app.navigator.js', definitions.navigator, err => {
      if (err) throw new Error(err);
    });
    fs.writeFile('./src/reducers/index.js', definitions.indexReducer, err => {
      if (err) throw new Error(err);
    });
    fs.writeFile('./src/reducers/navigation.reducer.js', definitions.reducer, err => {
      if (err) throw new Error(err);
    });
    resolve();
  });
}

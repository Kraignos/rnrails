#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const exec = require('child_process').execSync;
const child_process = require('child_process');
const initializer = require('./lib/init-project');
const componentInitializer = require('./lib/init-component');
const screenInitializer = require('./lib/init-screen');
const Promise = require('bluebird');
const fs = require('fs');

const successMessage = (message) => {
  return chalk.bold.green(message);
}

var exitOnError = (err) => {
  console.error(chalk.bold.red('An error occurred:'), err);
  process.exit(1);
}

program
  .version(require('./package.json').version);

program
  .command('new <name>')
  .option("-n, --native [native]", "Building the project with Native Code")
  .option("-r, --redux [redux]", "Setting up with Redux integration")
  .action((name, options) => {
    const withRedux = options.redux || false;
    const withNativeCode = options.native || false;
    const withOrWithout = withNativeCode ? 'with' : 'without';
    console.log(`Creating new React Native Project ${successMessage(name)} ${withOrWithout} native code...`);
    initializer.init(name, withNativeCode)
      .then(() => {
        console.log(successMessage('Creating source code structure...'));
        process.chdir(`./${name}`);
        fs.writeFile('index.js', "import './src/app';", err => {
          if (err) throw new Error(err);
        });
        fs.mkdirSync('./src');
        process.chdir('./src');
        fs.writeFile('app.js', '', err => {
          if (err) throw new Error(err);
        });
        fs.mkdirSync('./api');
        fs.mkdirSync('./assets');
        fs.mkdirSync('./components');
        fs.mkdirSync('./domain');
        fs.mkdirSync('./i18n');
        fs.mkdirSync('./screens');
        // We go back to the root
        process.chdir('..');
      })
      .then(() => {
        console.log('Setting up the environment...');
        return initializer.configureEnvironment();
      })
      .then(() => console.log(successMessage('Environment is set up!')))
      .then(() => {
        console.log('Generating home screen...');
        return screenInitializer.init('Home');
      })
      .then(() => {
        console.log('Generating settings screen...');
        return screenInitializer.init('Settings');
      })
      .then(() => console.log(successMessage('Screens are set up!')))
      .then(() => {
        console.log(successMessage('Installing react-navigation...'));
        return initializer.installDependencies(name, withNativeCode);
      })
      .then(() => {
        if (withRedux) {
          console.log(successMessage('Installing redux...'));
          return initializer.installRedux()
            .then(() => initializer.configureRedux());
        }
        return '';
      })
      .then(() => console.log(successMessage('react-navigation is set up!')))
      .then(() => console.log(successMessage('Installing chai enzyme sinon for testing...')))
      .then(() => initializer.installDevDependencies())
      .then(() => console.log(successMessage('Tests are all set up with chai & enzyme!')))
      .then(() => console.log(`🎉🎉  React Native Project ${successMessage(name)} has been created...`))
      .catch(exitOnError);
  });

  program
    .command('run <options>')
    .action(options => {
      initializer.run(options)
        .catch(exitOnError);
    });

  program
    .command('component <name>')
    .action((name) => {
      componentInitializer.init(name)
        .then(() => console.log(`${successMessage(name)} component has been successfully created!`))
        .catch(exitOnError);
    });

  program
    .command('screen <name>')
    .action((name) => {
      screenInitializer.init(name)
        .then(() => console.log(`${successMessage(name)} screen has been successfully created!`))
        .catch(exitOnError);
    });

program.parse(process.argv);

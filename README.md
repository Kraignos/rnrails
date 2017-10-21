# rnrails [WIP]
React Native on Rails is an opinionated CLI for React Native. It generates and configures a functional React Native project for you so that you just take care about the business of your app.

We all love React Native but setting a project can really be a blocking issue:
* which dependencies to chose for navigation, state, etc.
* how to structure your app
* native code or not

Enters RNRails. It creates a new project and configures everything for you:
* [react-native-navigation](https://reactnavigation.org/) for navigation
* [redux](http://redux.js.org/) for state management
  * Configured with react-native-navigation
* [redux-logger](https://github.com/evgenyrodionov/redux-logger) for logging
* [eslint](https://www.npmjs.com/package/eslint-config-fbjs) configured with Facebook rules
* [enzyme](http://airbnb.io/enzyme/) for testing
* [chai](http://chaijs.com/) for assertions
* [sinon](http://sinonjs.org/) for spies, stubs and mocks

# Installation
```
npm install -g rnrails
```

# Getting started
### Create your project
```
rnrails new APP_NAME
```

By default, it generates a project without native code by using [Create React Native App](https://github.com/react-community/create-react-native-app).

If want native code, you can still later on eject your app, or directly create it with native code with *-n* options. In this case, the app will be created using [React Native CLI](https://www.npmjs.com/package/react-native-cli).

### Start your project
No matter how you have created the project, to run it, just execute in the app directory:
```
rnrails run PLATFORM
```

It generates a Tab based app with 2 screens defined as an example for you.

### Test your project
```
yarn test
```

### Structure of the project
```
src/
   app.js       // Starting point of the app
   /api         // Where the API calls should be
   /assets      // Where the assets should be
   /components  // Where the components should be
   /domain      // Where you domain objects should be
   /i18n        // Where internationalization stuff should be
   /navigators  // Where your navigators should be
   /reducers    // Where your reducers should be
   /screens     // Where the definition of your screens should be
```
### Add a new screen
```
rnrails screen NAME
```
Creates a new file *NAME.screen.js* in *src/screens*

TODO: *add import in src/navigators/app.navigator.js and test file*

### Add a new component
```
rnrails component NAME
```
Creates a new file *NAME.component.js* in *src/components*

TODO: *add test file*

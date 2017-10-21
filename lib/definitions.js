const appDefinition =
`import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import AppReducer from './reducers';
import AppWithNavigationState from './navigators/app.navigator';

class RNRailsApp extends Component {
  store = createStore(AppReducer, applyMiddleware(logger));

  render() {
    return (
      <Provider store={this.store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}`;

const appNative =
`import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
${appDefinition}

AppRegistry.registerComponent('YourAppName', () => RNRailsApp);
`;

const appExpo =
`import React, { Component } from 'react';
${appDefinition}

export default () => <RNRailsApp />;
`;

const style =
`const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});`;

const component = `
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class MyScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Escaped',
    tabBarLabel: 'Escaped',
  });

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>MyScreen</Text>
      </View>
    );
  }
}

${style}`;

const navigator =
`import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  addNavigationHelpers,
  StackNavigator,
  TabBarBottom,
  TabNavigator,
} from 'react-navigation';

import HomeScreen from '../screens/home.screen';
import SettingsScreen from '../screens/settings.screen';

const homeNavigator = StackNavigator({
  Home: {
    screen: HomeScreen,
    // First screen in the stack so we don't want any 'back' button
    navigationOptions: {
      headerLeft: null,
    },
  },
  // TODO Put here your other screens
}, {
  navigationOptions: {
    headerBackTitle: null,
  },
});

const settingsNavigator = StackNavigator({
  Settings: {
    screen: SettingsScreen,
    // First screen in the stack so we don't want any 'back' button
    navigationOptions: {
      headerLeft: null,
    },
  },
  // TODO Put here your other screens
}, {
  navigationOptions: {
    headerBackTitle: null,
  },
});

export const AppNavigator = TabNavigator({
  Home: { screen: homeNavigator },
  Settings: { screen: settingsNavigator },
}, {
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: 'pink',
  },
});

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);`;

const indexReducer =
`import { combineReducers } from 'redux';

import NavigationReducer from './navigation.reducer';

const AppReducer = combineReducers({
  nav: NavigationReducer,
});

export default AppReducer;`;

const reducer =
`import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../navigators/app.navigator';

const initialAction = AppNavigator.router.getActionForPathAndParams('Home');
const initialState = AppNavigator.router.getStateForAction(initialAction);

const nav = (state = initialState, action) => {
  let nextState;
  switch (action.type) {
    case 'SomeScreen':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: action.type }),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }
  // Simply return the original 'state' if 'nextState' is null or undefined.
  return nextState || state;
}

export default nav;
`;

const jest =
`import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
`;

module.exports = {
  appExpo: appExpo,
  appNative: appNative,
  component: component,
  indexReducer: indexReducer,
  jest: jest,
  navigator: navigator,
  reducer: reducer,
};

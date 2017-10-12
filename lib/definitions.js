const appDefinition =
`import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import HomeScreen from './screens/home.screen';
import SettingsScreen from './screens/settings.screen';

const TabsNavigator = TabNavigator({
  Home: {
    screen: HomeScreen,
  },
  Settings: {
    screen: SettingsScreen,
  },
}, {
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
});

const RNRailsApp = StackNavigator({
  App: {
    screen: TabsNavigator,
    backBehavior: 'none',
  },
}, {
  navigationOptions: {
    headerBackTitle: null,
  },
});`;

const appNative =
`import { AppRegistry } from 'react-native';
${appDefinition}

AppRegistry.registerComponent('RNRailsApp', () => RNRailsApp);
`;

const appExpo =
`import React from 'react';
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

module.exports = {
  appExpo: appExpo,
  appNative: appNative,
  component: component
};

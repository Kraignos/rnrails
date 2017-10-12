const app =
`import { AppRegistry } from 'react-native';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
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

const SimpleApp = StackNavigator({
  App: {
    screen: TabsNavigator,
    backBehavior: 'none',
  },
}, {
  navigationOptions: {
    headerBackTitle: null,
  },
});

AppRegistry.registerComponent('YourAppName', () => SimpleApp);
`;

const component = `
import React, { Component } from 'react';
import { Text, View } from 'react-native';

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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>MyScreen</Text>
      </View>
    );
  }
}`;

module.exports = {
  'app.js': app,
  component: component
};

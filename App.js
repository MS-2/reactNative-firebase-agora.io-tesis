/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import { createAppContainer } from 'react-navigation';
import RootNavigator from './src/root-navigator';

const Root = createAppContainer(RootNavigator);

export default class App extends Component {
  render() {
    return (
        <Root />
    );
  }
}

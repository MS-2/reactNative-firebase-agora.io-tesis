/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import Pages, { routesMap } from './pages';
import { createStackNavigator } from 'react-navigation-stack';

export default createStackNavigator(
  {
    home:  {screen: Pages },
    index: {screen: routesMap.index},
    admin: {screen: routesMap.admin},
    agora: {screen: routesMap.agora},
    lista: {screen: routesMap.lista},
    crear: {screen: routesMap.crear},
    vista: {screen: routesMap.vista},
    chat:  {screen: routesMap.chat},
    cambiar: {screen: routesMap.cambiar}
  },
  {
    initialRouteName: 'index',
  }

);

const styles = StyleSheet.create({
  colors: {
    backgroundColor: "#6200ee"
  }
})
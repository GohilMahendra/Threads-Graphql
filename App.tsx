/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler'
import React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  Text
} from 'react-native';
import RootStack from './src/navigations/RootStack';
import { ThemeProvider } from './src/globals/ThemeProvider';
import { Provider } from 'react-redux';
import store from './src/redux/store';
const App = () =>
{
  return(
    <Provider store={store}>
      <ThemeProvider>
        <RootStack/>
      </ThemeProvider>
    </Provider>
  )
}
export default App;

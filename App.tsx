/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  Text
} from 'react-native';
import RootStack from './src/navigations/RootStack';
import { ThemeProvider } from './src/globals/ThemeProvider';

const App = () =>
{
  return(
    <ThemeProvider>
       <SafeAreaView style={{
      flex:1
    }}>
       <RootStack/>
      </SafeAreaView>
    </ThemeProvider>
  )
}
export default App;

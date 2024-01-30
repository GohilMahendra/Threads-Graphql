/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler'
import React from 'react';
import RootStack from './src/navigations/RootStack';
import { ThemeProvider } from './src/globals/ThemeProvider';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { ApolloProvider  } from "@apollo/client";
import { client } from './src/graphql';

const App = () =>
{
  return(
    <ApolloProvider client={client}>
        <Provider store={store}>
        <ThemeProvider>
          <RootStack/>
        </ThemeProvider>
      </Provider>
    </ApolloProvider>
  )
}
export default App;

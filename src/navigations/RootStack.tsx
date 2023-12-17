import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import AuthStack from './AuthStack'
import { NavigationContainer } from '@react-navigation/native'
import UserTab from './UserTab'
import CreatePost from '../screens/home/CreatePost'
import MediaViewer from '../screens/home/MediaViewer'
import SplashScreen from '../screens/auth/SplashScreen'

export type RootStackType =
    {
        AuthStack: undefined,
        UserTab: undefined,
        CreatePost: undefined,
        MediaViewer: undefined,
        SplashScreen: undefined
    }


const RootStackNavigator = createNativeStackNavigator<RootStackType>()
const RootStack = () => {
    return (
        <NavigationContainer>
            <RootStackNavigator.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName='SplashScreen'
            >
                <RootStackNavigator.Screen
                    name='SplashScreen'
                    component={SplashScreen}
                />
                <RootStackNavigator.Screen
                    name='AuthStack'
                    component={AuthStack}
                />
                <RootStackNavigator.Screen
                    name='UserTab'
                    component={UserTab}
                />
                <RootStackNavigator.Screen
                    name='CreatePost'
                    component={CreatePost}
                />
                <RootStackNavigator.Screen
                    name='MediaViewer'
                    component={MediaViewer}
                />

            </RootStackNavigator.Navigator>
        </NavigationContainer>
    )
}
export default RootStack
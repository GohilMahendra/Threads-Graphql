import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import AuthStack from './AuthStack'
import { NavigationContainer } from '@react-navigation/native'
import UserTab from './UserTab'
import CreatePost from '../screens/home/CreatePost'
import MediaViewer from '../screens/home/MediaViewer'
import SplashScreen from '../screens/auth/SplashScreen'
import { Platform, StatusBar, View } from 'react-native'
import UseTheme from '../globals/UseTheme'
import QoutePost from '../screens/profile/QoutePost'
import { Thread } from '../types/Post'

export type RootStackType =
    {
        AuthStack: undefined,
        UserTab: undefined,
        CreatePost: undefined,
        MediaViewer: undefined,
        SplashScreen: undefined,
        QoutePost: {
            Thread: Thread
        }
    }


const RootStackNavigator = createNativeStackNavigator<RootStackType>()

const RootStack = () => {
    const {theme} = UseTheme()
    return (
        <NavigationContainer>
            <StatusBar
            backgroundColor={theme.background_color}
            barStyle={Platform.OS=="ios"?"dark-content":"light-content"}
            />
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
                <RootStackNavigator.Group screenOptions={{ presentation: 'modal',
                contentStyle:{
                    marginTop:20,
                    borderTopRightRadius:20,
                    borderTopLeftRadius:20
                }
            }}>
                    <RootStackNavigator.Screen name="CreatePost" component={CreatePost} />
                    <RootStackNavigator.Screen name="QoutePost" component={QoutePost} />
                </RootStackNavigator.Group>
            </RootStackNavigator.Navigator>
        </NavigationContainer>
    )
}
export default RootStack
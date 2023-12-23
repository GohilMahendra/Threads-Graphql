import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import UserProfile from '../screens/profile/UserProfile'
import Home from '../screens/home/Home'

export type HomeStackParams = 
{
     Home: undefined,
     UserProfile: {
        userId: string
     }
}
const HomeStackNavigator = createNativeStackNavigator<HomeStackParams>()
const HomeStack = () =>
{
    return(
        <HomeStackNavigator.Navigator
        initialRouteName='Home'
        screenOptions={{
            headerShown:false
        }}
        >
            <HomeStackNavigator.Screen
            name='Home'
            component={Home}
            />
            <HomeStackNavigator.Screen
            name='UserProfile'
            component={UserProfile}
            />
        </HomeStackNavigator.Navigator>
    )
}
export default HomeStack
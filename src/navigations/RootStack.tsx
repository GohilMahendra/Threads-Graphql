import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import AuthStack from './AuthStack'
import { NavigationContainer } from '@react-navigation/native'
import UserTab from './UserTab'

export type RootStackType = 
{
     AuthStack: undefined,
     UserTab: undefined
}


const RootStackNavigator = createNativeStackNavigator<RootStackType>()
const RootStack = () =>
{
    return(
        <NavigationContainer>
            <RootStackNavigator.Navigator
             screenOptions={{
                headerShown:false
            }}
            initialRouteName='UserTab'
            >
                <RootStackNavigator.Screen
                name='AuthStack'
                component={AuthStack}
                />
                <RootStackNavigator.Screen
                name='UserTab'
                component={UserTab}
                />
            </RootStackNavigator.Navigator>
        </NavigationContainer>
    )
}
export default RootStack
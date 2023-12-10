import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import SignIn from '../screens/auth/Signin'
import SignUp from '../screens/auth/SignUp'

export type AuthStackType = 
{
     SignIn: undefined,
     SignUp: undefined
}


const AuthStackNavigator = createNativeStackNavigator<AuthStackType>()
const AuthStack = () =>
{
    return(
        <AuthStackNavigator.Navigator
        initialRouteName='SignIn'
        screenOptions={{
            headerShown:false
        }}
        >
            <AuthStackNavigator.Screen
            name='SignIn'
            component={SignIn}
            />
            <AuthStackNavigator.Screen
            name='SignUp'
            component={SignUp}
            />
        </AuthStackNavigator.Navigator>
    )
}
export default AuthStack
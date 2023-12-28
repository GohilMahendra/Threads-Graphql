import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import SignIn from '../screens/auth/Signin'
import SignUp from '../screens/auth/SignUp'
import OtpVerification from '../screens/auth/OtpVerification'

export type AuthStackType = 
{
     SplashScreen:undefined,
     SignIn: undefined,
     SignUp: undefined,
     OtpVerification: {
        email: string
     },
}
const AuthStackNavigator = createNativeStackNavigator<AuthStackType>()
const AuthStack = () =>
{
    return(
        <AuthStackNavigator.Navigator
        initialRouteName='SplashScreen'
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
            <AuthStackNavigator.Screen
            name='OtpVerification'
            component={OtpVerification}
            />
        </AuthStackNavigator.Navigator>
    )
}
export default AuthStack
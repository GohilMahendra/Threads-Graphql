import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import Profile from '../screens/profile/Profile'
import EditProfile from '../screens/profile/EditProfile'
import Settings from '../screens/profile/Settings'

export type ProfileStacktype =
    {
        Profile: undefined,
        EditProfile: undefined,
        Settings: undefined
    }
const ProfileStackNavigator = createNativeStackNavigator<ProfileStacktype>()
const ProfileStack = () => {
    return (
        <ProfileStackNavigator.Navigator
            initialRouteName='Profile'
            screenOptions={{
                headerShown: false
            }}
        >
            <ProfileStackNavigator.Screen
                name='Profile'
                component={Profile}
            />
            <ProfileStackNavigator.Screen
                name='EditProfile'
                component={EditProfile}
            />
             <ProfileStackNavigator.Screen
                name='Settings'
                component={Settings}
            />
        </ProfileStackNavigator.Navigator>
    )
}
export default ProfileStack
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import Profile from '../screens/profile/Profile'
import EditProfile from '../screens/profile/EditProfile'
import Settings from '../screens/profile/Settings'
import UserProfile from '../screens/profile/UserProfile'

export type ProfileStacktype =
    {
        Profile: undefined,
        EditProfile: undefined,
        Settings: undefined,
        UserProfile: {
            userId: string
         }
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
            <ProfileStackNavigator.Screen
            name='UserProfile'
            component={UserProfile}
            />
        </ProfileStackNavigator.Navigator>
    )
}
export default ProfileStack
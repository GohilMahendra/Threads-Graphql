import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import Favorites from '../screens/favorites/Fevorites'
import UserProfile from '../screens/profile/UserProfile'

export type FavoriteStackType =
    {
        Favorite: undefined,
        UserProfile: {
            userId: string
         }
    }
const FavoriteStackNavigator = createNativeStackNavigator<FavoriteStackType>()
const FavoriteStack = () => {
    return (
        <FavoriteStackNavigator.Navigator
            initialRouteName='Favorite'
            screenOptions={{
                headerShown: false
            }}
        >
            <FavoriteStackNavigator.Screen
                name='Favorite'
                component={Favorites}
            />
            <FavoriteStackNavigator.Screen
            name='UserProfile'
            component={UserProfile}
            />
        </FavoriteStackNavigator.Navigator>
    )
}
export default FavoriteStack
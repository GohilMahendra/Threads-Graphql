import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import Favorites from '../screens/favorites/Fevorites'

export type FavoriteStackType =
    {
        Favorite: undefined,
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
        </FavoriteStackNavigator.Navigator>
    )
}
export default FavoriteStack
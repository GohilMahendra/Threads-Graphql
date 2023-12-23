import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import Search from '../screens/search/Search'
import UserProfile from '../screens/profile/UserProfile'

export type SearchStackParams = 
{
     Search: undefined,
     UserProfile: {
        userId: string
     }
}
const SearchStackNavigator = createNativeStackNavigator<SearchStackParams>()
const SearchStack = () =>
{
    return(
        <SearchStackNavigator.Navigator
        initialRouteName='Search'
        screenOptions={{
            headerShown:false
        }}
        >
            <SearchStackNavigator.Screen
            name='Search'
            component={Search}
            />
            <SearchStackNavigator.Screen
            name='UserProfile'
            component={UserProfile}
            />
        </SearchStackNavigator.Navigator>
    )
}
export default SearchStack
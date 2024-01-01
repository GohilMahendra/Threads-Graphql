import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import Search from '../screens/search/Search'
import UserProfile from '../screens/profile/UserProfile'
import PostSearch from '../screens/search/PostSearch'

export type SearchStackParams =
    {
        Search: undefined,
        UserProfile: {
            userId: string
        },
        PostSearch: {
            searchTerm: string
        }
    }
const SearchStackNavigator = createNativeStackNavigator<SearchStackParams>()
const SearchStack = () => {
    return (
        <SearchStackNavigator.Navigator
            initialRouteName='Search'
            screenOptions={{
                headerShown: false
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
            <SearchStackNavigator.Screen
                name='PostSearch'
                component={PostSearch}
            />
        </SearchStackNavigator.Navigator>
    )
}
export default SearchStack
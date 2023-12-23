import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/home/Home";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ProfileStack from "./ProfileStack";
import UseTheme from "../globals/UseTheme";
import SearchStack from "./SearchStack";
import HomeStack from "./FeedStack";
export type UserTabType = 
{
    HomeStack: undefined,
    SearchStack: undefined,
    Likes: undefined
    ProfileStack: undefined
}
const UserTab = () =>
{
    const UserTabNavigator = createBottomTabNavigator<UserTabType>()
    const {theme} = UseTheme()
    return(
        <UserTabNavigator.Navigator
        initialRouteName={"HomeStack"}
        screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
                backgroundColor: theme.background_color
              },
        }}
        >
            <UserTabNavigator.Screen
            name="HomeStack"
            component={HomeStack}
            options={{
                tabBarIcon:({color,focused,size})=>(
                    <FontAwesome
                    name="home"
                    size={30}
                    color={focused? theme.text_color: theme.secondary_text_color}
                    />
                )
            }}
            />
             <UserTabNavigator.Screen
            name="SearchStack"
            component={SearchStack}
            options={{
                tabBarIcon:({color,focused,size})=>(
                    <FontAwesome
                    name="search"
                    size={25}
                    color={focused? theme.text_color: theme.secondary_text_color}
                    />
                )
            }}
            />
             <UserTabNavigator.Screen
            name="Likes"
            component={Home}
            options={{
                tabBarIcon:({color,focused,size})=>(
                    <FontAwesome
                    name="heart"
                    size={25}
                    color={focused? theme.text_color: theme.secondary_text_color}
                    />
                )
            }}
            />
             <UserTabNavigator.Screen
            name="ProfileStack"
            component={ProfileStack}
            options={{
                tabBarIcon:({color,focused,size})=>(
                    <FontAwesome
                    name="user"
                    size={30}
                    color={focused? theme.text_color: theme.secondary_text_color}
                    />
                )
            }}
            />
        </UserTabNavigator.Navigator>
    )
}
export default UserTab
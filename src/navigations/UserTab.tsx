import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/home/Home";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Fontisto from "react-native-vector-icons/Fontisto";
import Profile from "../screens/profile/Profile";
import ProfileStack from "./ProfileStack";
export type UserTabType = 
{
    Home: undefined,
    Search: undefined,
    Likes: undefined
    ProfileStack: undefined
}
const UserTab = () =>
{
    const UserTabNavigator = createBottomTabNavigator<UserTabType>()

    return(
        <UserTabNavigator.Navigator
        initialRouteName={"Home"}
        screenOptions={{
            headerShown: false,
            tabBarShowLabel: false
        }}
        >
            <UserTabNavigator.Screen
            name="Home"
            component={Home}
            options={{
                tabBarIcon:({color,focused,size})=>(
                    <FontAwesome
                    name="home"
                    size={30}
                    color={focused?"black":"silver"}
                    />
                )
            }}
            />
             <UserTabNavigator.Screen
            name="Search"
            component={Home}
            options={{
                tabBarIcon:({color,focused,size})=>(
                    <FontAwesome
                    name="search"
                    size={25}
                    color={focused?"black":"grey"}
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
                    color={focused?"black":"grey"}
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
                    color={focused?"black":"grey"}
                    />
                )
            }}
            />
        </UserTabNavigator.Navigator>
    )
}
export default UserTab
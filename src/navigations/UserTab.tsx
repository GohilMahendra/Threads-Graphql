import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/home/Home";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export type UserTabType = 
{
    Home: undefined,
    Search: undefined,
    Likes: undefined
    Profile: undefined
}
const UserTab = () =>
{
    const UserTabNavigator = createBottomTabNavigator<UserTabType>()

    return(
        <UserTabNavigator.Navigator
        initialRouteName={"Home"}
        screenOptions={{
            headerShown: false
        }}
        >
            <UserTabNavigator.Screen
            name="Home"
            component={Home}
            options={{
                tabBarIcon:({color,focused,size})=>(
                    <FontAwesome
                    name="music"
                    size={30}
                    color={"black"}
                    />
                )
            }}
            />
        </UserTabNavigator.Navigator>
    )
}
export default UserTab
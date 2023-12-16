import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation,CompositeNavigationProp} from '@react-navigation/native';
import React, { useEffect } from 'react'
import { SafeAreaView, Text } from "react-native";
import { AuthStackType } from '../../navigations/AuthStack';
import { RootStackType } from '../../navigations/RootStack';
import { UserTabType } from '../../navigations/UserTab';
import { useAppDispatch } from '../../redux/store';
import { setUser } from '../../redux/slices/UserSlice';

const SplashScreen = () =>
{
    const dispatch = useAppDispatch()
    type compositeAuthUser = CompositeNavigationProp<NavigationProp<AuthStackType>,NavigationProp<UserTabType>>
    const navigation = useNavigation<compositeAuthUser>()
    const signIn = async() =>
    {
        const token = await AsyncStorage.getItem("token")

        if(token)
        {
            const user = await AsyncStorage.getItem("user")
            const user_obj = user ?JSON.parse(user): null
            if(user_obj)
            {
                dispatch(setUser(user_obj))
            }
            navigation.navigate("Home")
        }
        else
        {
            navigation.navigate("SignIn")
        }

    }
    useEffect(()=>{
        setTimeout(() => {
            signIn()
        }, 1000);
    },[])
    return(
        <SafeAreaView style={{
            flex:1,
            justifyContent:"center",
            alignItems:"center"
        }}>
            <Text>SplashScreen</Text>
            
        </SafeAreaView>
    )
}
export default SplashScreen

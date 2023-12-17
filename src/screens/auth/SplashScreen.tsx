import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation,CompositeNavigationProp} from '@react-navigation/native';
import React, { useEffect } from 'react'
import { SafeAreaView, Text } from "react-native";
import { RootStackType } from '../../navigations/RootStack';
import { UserTabType } from '../../navigations/UserTab';
import { useAppDispatch } from '../../redux/store';
import { SignInAction } from '../../redux/slices/UserSlice';

const SplashScreen = () =>
{
    const dispatch = useAppDispatch()
    type compositeAuthUser = CompositeNavigationProp<NavigationProp<RootStackType>,NavigationProp<UserTabType>>
    const navigation = useNavigation<compositeAuthUser>()
    const signIn = async() =>
    {
        try
        {
            const email = await AsyncStorage.getItem("email")
            const password = await AsyncStorage.getItem("password")

            if(!email || !password)
            {
                navigation.navigate("AuthStack")
            }
            else
            {
                const fullfilled = await dispatch(SignInAction({email,password}))
                if(SignInAction.fulfilled.match(fullfilled))
                {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "UserTab" }],
                      });
                }
                else
                {
                    navigation.navigate("AuthStack")
                }
            }
        }
        catch(err)
        {
            console.log(err)
        }

    }
    useEffect(()=>{
        setTimeout(() => {
            signIn()
        }, 2000);
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

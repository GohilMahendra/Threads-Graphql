import React, { useState } from 'react'
import { View, Text, SafeAreaView, Image, Dimensions,TextInput, TouchableOpacity, Switch, Pressable } from 'react-native'
import { NavigationProp,CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackType } from '../../navigations/AuthStack';
import UseTheme from '../../globals/UseTheme';
import { loginUser } from '../../apis/UserAPI';
import { RootStackType } from '../../navigations/RootStack';
import { UserResponse } from '../../types/User';
import { useAppDispatch } from '../../redux/store';
import { SignInAction } from '../../redux/slices/UserSlice';
import { UserTabType } from '../../navigations/UserTab';
const { height, width} = Dimensions.get("window")
const SignIn = () =>
{
    type composeTeAuthTab = CompositeNavigationProp<NavigationProp<AuthStackType>,NavigationProp<RootStackType>>
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [active,setActive] = useState(false)
    const {theme} = UseTheme()
    const navigation = useNavigation<composeTeAuthTab>()
    const dispatch = useAppDispatch()
    const signInUser = async() =>
    {
      const responseStaus = await dispatch(SignInAction({
        email: email,
        password:password
       }))

       console.log(responseStaus)
       if(SignInAction.fulfilled.match(responseStaus))
       {
        navigation.navigate("UserTab")
       }
    }
    return(
        <SafeAreaView style={{
            flex:1,
            justifyContent:"center",
            alignItems:"center",
            padding:20,
            backgroundColor: theme.background_color
        }}>
            <View style={{
                flexDirection:"row",
                padding:15,
                backgroundColor: theme.secondary_background_color,
                width:width*90/100,
                borderRadius:10,
                marginVertical:20
            }}>
                <TextInput
                autoCapitalize={"none"}
                value={email}
                onChangeText={text=>setEmail(text)}
                placeholderTextColor={theme.placeholder_color}
                placeholder={"email ..."}
                style={{
                    flex:1,
                    padding:5,
                }}
                />
            </View>
            <View style={{
                flexDirection:"row",
                padding:15,
                backgroundColor: theme.secondary_background_color,
                width:width*90/100,
                borderRadius:10,
                marginVertical:10
            }}>
                <TextInput
                value={password}
                onChangeText={text=>setPassword(text)}
                placeholderTextColor={theme.placeholder_color}
                placeholder={"password ..."}
                style={{
                    flex:1,
                    padding:5,
                    color: theme.text_color
                }}
                />
            </View>

            <TouchableOpacity
            onPress={()=>signInUser()}
            style={{
                width: width*90/100,
                padding:20,
                backgroundColor: theme.primary_color,
                borderRadius:10,
                justifyContent:"center",
                alignItems:"center",
                marginVertical:20
            }}
            >
                <Text style={{
                    fontSize:18,
                    color: "white",
                    fontWeight:"bold"
                }}>
                    Sign In
                </Text>
            </TouchableOpacity>

            <View style={{
                flexDirection:'row'
            }}>
                <Text style={{color: theme.text_color}}>Dont have any account ? </Text>
                <Pressable
                onPress={()=>navigation.navigate("SignUp")}
                >
                    <Text
                    style={{
                        textDecorationLine:"underline",
                        color: theme.text_color
                    }}
                    >Regsiter Here</Text>
                </Pressable>
            </View>

        </SafeAreaView>
    )
}
export default SignIn
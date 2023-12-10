import React, { useState } from 'react'
import { View, Text, SafeAreaView, Image, Dimensions,TextInput, TouchableOpacity, Switch, Pressable } from 'react-native'
import { applogo } from "../../globals/asstes";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackType } from '../../navigations/AuthStack';
const { height, width} = Dimensions.get("screen")
const SignUp = () =>
{
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [rePassword,setRePassword] = useState("")
    const [userName,setUserName] = useState("")
    const [fullName,setFullName] = useState("")
    const navigation = useNavigation<NavigationProp<AuthStackType,"SignIn">>()

    return(
        <SafeAreaView style={{
            flex:1,
            justifyContent:"center",
            alignItems:"center",
            padding:20
        }}>
             <View style={{
                flexDirection:"row",
                padding:15,
                backgroundColor:"#E5E5E5",
                width:width*90/100,
                borderRadius:10,
                marginVertical:10
            }}>
                <TextInput
                value={userName}
                onChangeText={text=>setUserName(text)}
                placeholderTextColor={"grey"}
                placeholder={"username ..."}
                style={{
                    flex:1,
                    padding:5,
                }}
                />
            </View>
            <View style={{
                flexDirection:"row",
                padding:15,
                backgroundColor:"#E5E5E5",
                width:width*90/100,
                borderRadius:10,
                marginVertical:10
            }}>
                <TextInput
                value={fullName}
                onChangeText={text=>setFullName(text)}
                placeholderTextColor={"grey"}
                placeholder={"fullname ..."}
                style={{
                    flex:1,
                    padding:5,
                }}
                />
            </View>
            <View style={{
                flexDirection:"row",
                padding:15,
                backgroundColor:"#E5E5E5",
                width:width*90/100,
                borderRadius:10,
                marginVertical:10
            }}>
                <TextInput
                value={email}
                onChangeText={text=>setEmail(text)}
                placeholderTextColor={"grey"}
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
                backgroundColor:"#E5E5E5",
                width:width*90/100,
                borderRadius:10,
                marginVertical:10
            }}>
                <TextInput
                value={password}
                onChangeText={text=>setPassword(text)}
                placeholderTextColor={"grey"}
                placeholder={"password ..."}
                secureTextEntry
                style={{
                    flex:1,
                    padding:5,
                }}
                />
            </View>
            <View style={{
                flexDirection:"row",
                padding:15,
                backgroundColor:"#E5E5E5",
                width:width*90/100,
                borderRadius:10,
                marginVertical:10
            }}>
                <TextInput
                secureTextEntry
                value={rePassword}
                onChangeText={text=>setRePassword(text)}
                placeholderTextColor={"grey"}
                placeholder={"re-password ..."}
                style={{
                    flex:1,
                    padding:5,
                }}
                />
            </View>

            <TouchableOpacity
            style={{
                width: width*90/100,
                padding:20,
                backgroundColor:"black",
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
                    Sign Up
                </Text>
            </TouchableOpacity>

            <View style={{
                flexDirection:'row'
            }}>
                <Text>Already have an account ? </Text>
                <Pressable
                onPress={()=>navigation.navigate("SignIn")}
                >
                    <Text
                    style={{
                        textDecorationLine:"underline"
                    }}
                    >Login Here</Text>
                </Pressable>
            </View>

        </SafeAreaView>
    )
}
export default SignUp
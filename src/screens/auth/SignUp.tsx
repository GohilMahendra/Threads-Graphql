import React, { useState } from 'react'
import { View, Text, SafeAreaView, Image, Dimensions, TextInput, TouchableOpacity, Switch, Pressable, ScrollView, StyleSheet } from 'react-native'
import { applogo } from "../../globals/asstes";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackType } from '../../navigations/AuthStack';
import { signUpUser } from '../../apis/UserAPI';
import UseTheme from '../../globals/UseTheme';
const { height, width } = Dimensions.get("screen")
const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rePassword, setRePassword] = useState("")
    const [userName, setUserName] = useState("")
    const [fullName, setFullName] = useState("")
    const navigation = useNavigation<NavigationProp<AuthStackType, "SignIn">>()
    const { theme } = UseTheme()
    const SignUp = async () => {
        try {

            const email_lowercase = email.toLowerCase()
            const username_lowercase = userName.toLowerCase()
            const fullname_lowercase = fullName.toLowerCase()
            const response = await signUpUser({
                email: email_lowercase,
                password: password,
                fullname: fullname_lowercase,
                username: username_lowercase
            })
            navigation.navigate("OtpVerification", {
                email: email_lowercase
            })
        }
        catch (err) {
            console.log(JSON.stringify(err))
        }
    }
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background_color }]}>
            <ScrollView
                contentContainerStyle={styles.containerView}
                style={styles.scrollContainer}>
                <Image
                    source={applogo}
                    tintColor={theme.text_color}
                    style={styles.imageLogo}
                />
                <View style={[styles.inputContainer, { backgroundColor: theme.secondary_color, }]}>
                    <TextInput
                        value={userName}
                        autoCapitalize={"none"}
                        onChangeText={text => setUserName(text)}
                        placeholderTextColor={"grey"}
                        placeholder={"username ..."}
                        style={[styles.input, { color: theme.text_color, }]}
                    />
                </View>
                <View style={[styles.inputContainer, { backgroundColor: theme.secondary_color, }]}>
                    <TextInput
                        value={fullName}
                        autoCapitalize={"none"}
                        onChangeText={text => setFullName(text)}
                        placeholderTextColor={"grey"}
                        placeholder={"fullname ..."}
                        style={[styles.input, { color: theme.text_color, }]}
                    />
                </View>
                <View style={[styles.inputContainer, { backgroundColor: theme.secondary_color, }]}>
                    <TextInput
                        value={email}
                        autoCapitalize={"none"}
                        onChangeText={text => setEmail(text)}
                        placeholderTextColor={"grey"}
                        placeholder={"email ..."}
                        style={[styles.input, { color: theme.text_color, }]}
                    />
                </View>
                <View style={[styles.inputContainer, { backgroundColor: theme.secondary_color, }]}>
                    <TextInput
                        value={password}
                        autoCapitalize={"none"}
                        onChangeText={text => setPassword(text)}
                        placeholderTextColor={"grey"}
                        placeholder={"password ..."}
                        secureTextEntry
                        style={[styles.input, { color: theme.text_color, }]}
                    />
                </View>
                <View style={[styles.inputContainer, { backgroundColor: theme.secondary_color, }]}>
                    <TextInput
                        secureTextEntry
                        autoCapitalize={"none"}
                        value={rePassword}
                        onChangeText={text => setRePassword(text)}
                        placeholderTextColor={"grey"}
                        placeholder={"re-password ..."}
                        style={[styles.input, { color: theme.text_color, }]}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => SignUp()}
                    style={[styles.btnSignUp, { backgroundColor: theme.primary_color, }]}
                >
                    <Text style={styles.txtSignUp}>Sign Up</Text>
                </TouchableOpacity>

                <View style={styles.rowNavigation}>
                    <Text style={{ color: theme.text_color }}>Already have an account ? </Text>
                    <Pressable
                        onPress={() => navigation.navigate("SignIn")}
                    >
                        <Text
                            style={[styles.txtLoginHere, { color: theme.text_color }]}
                        >Login Here</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default SignUp
const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    containerView:
    {
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContainer:
    {
        flex: 1,
        padding: 20,
    },
    imageLogo:
    {
        height: 50,
        width: 50,
        marginVertical: 10
    },
    inputContainer:
    {
        flexDirection: "row",
        padding: 15,
        width: width * 90 / 100,
        borderRadius: 10,
        marginVertical: 10
    },
    input:
    {
        flex: 1,
        padding: 5,
    },
    btnSignUp:
    {
        width: width * 90 / 100,
        padding: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20
    },
    txtSignUp:
    {
        fontSize: 18,
        color: "white",
        fontWeight: "bold"
    },
    rowNavigation:
    {
        flexDirection: 'row'
    },
    txtLoginHere:
    {
        textDecorationLine: "underline",
    }
})
import React, { useState } from "react";
import { View, Alert, Text, SafeAreaView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import UseTheme from "../../globals/UseTheme";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProfileRootComposite } from "../../navigations/Types";
import { scaledFont } from "../../globals/utilities";
const Settings = () => {
    const { theme, setTheme } = UseTheme()
    const navigation = useNavigation<ProfileRootComposite>()
    const [darkTheme, setDarkTheme] = useState(theme.mode == "dark")

    const changeTheme = async () => {
        setTheme(darkTheme ? "light" : "dark")
        setDarkTheme(!darkTheme)
        await AsyncStorage.setItem("theme", theme.mode)
    }
    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        onSignOut()
                    },
                },
            ],
            { cancelable: false }
        );
    };
    const onSignOut = async () => {
        await AsyncStorage.removeItem("token")
        await AsyncStorage.removeItem("email")
        await AsyncStorage.removeItem("password")
        await AsyncStorage.removeItem("theme")
        navigation.dispatch({
            ...CommonActions.reset({
                index: 0,
                routes: [{ name: 'AuthStack' }],
            }),
        })
    }
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background_color }]}>
            <View style={[styles.headerContainer, { borderColor: theme.text_color, }]}>
                <FontAwesome
                    onPress={() => navigation.goBack()}
                    name="angle-left"
                    size={scaledFont(25)}
                    color={theme.text_color}
                />
                <Text style={[styles.txtSettings, { color: theme.text_color }]}>Settings</Text>
                <View />
            </View>
            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("EditProfile")}
                    style={styles.btnRowContainer}>
                    <Ionicons
                        name="person-circle"
                        size={scaledFont(25)}
                        color={theme.text_color}
                    />
                    <Text style={[styles.textOption, { color: theme.text_color, }]}>Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnRowContainer}>
                    <Ionicons
                        name="help-circle"
                        size={scaledFont(25)}
                        color={theme.text_color}
                    />
                    <Text style={[styles.textOption, { color: theme.text_color, }]}>Help</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnRowContainer}>
                    <Ionicons
                        name="information-circle-outline"
                        size={scaledFont(25)}
                        color={theme.text_color}
                    />
                    <Text style={[styles.textOption, { color: theme.text_color, }]}>About</Text>
                </TouchableOpacity>
                <View style={[styles.btnRowContainer, { justifyContent: "space-between" }]}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <MaterialIcons
                            name="dark-mode"
                            size={scaledFont(25)}
                            color={theme.text_color}
                        />
                        <Text style={[styles.textOption, { color: theme.text_color, }]}>Dark Mode</Text>
                    </View>
                    <Switch
                        
                        value={darkTheme}
                        onChange={() => changeTheme()}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => handleSignOut()}
                    style={styles.btnRowContainer}>
                    <Ionicons
                        name="log-out"
                        size={scaledFont(25)}
                        color={theme.text_color}
                    />
                    <Text style={[styles.textOption, { color: theme.text_color, }]}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
export default Settings
const styles = StyleSheet.create({
    container:
    {
        flex: 1
    },
    headerContainer:
    {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        justifyContent: "space-between",
        padding: 10,
        paddingVertical: 15
    },
    txtSettings:
    {
        fontSize: scaledFont(20)
    },
    optionsContainer:
    {
        flex: 1,
        padding: scaledFont(20)
    },
    btnRowContainer:
    {
        flexDirection: 'row',
        alignItems: "center",
        marginBottom: 10
    },
    textOption:
    {
        fontSize: scaledFont(15),
        marginLeft: 20
    }
})  
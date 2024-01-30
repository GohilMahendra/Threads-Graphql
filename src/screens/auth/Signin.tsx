import React, { useState } from 'react'
import { 
    View, 
    Text, 
    SafeAreaView, 
    Image, 
    Dimensions, 
    TextInput, 
    TouchableOpacity, 
    Pressable, 
    StyleSheet 
} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import UseTheme from '../../globals/UseTheme';
import { RootState, useAppDispatch } from '../../redux/store';
import { SignInAction } from '../../redux/actions/UserActions';
import { useSelector } from 'react-redux';
import Loader from '../../components/global/Loader';
import { composeteAuthRootStack } from '../../navigations/Types';
import { applogo } from '../../globals/asstes';
import { scaledFont } from '../../globals/utilities';
const { height, width } = Dimensions.get("window")
const SignIn = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const loading = useSelector((state: RootState) => state.User.loading)
    const error = useSelector((state: RootState) => state.User.error)
    const { theme } = UseTheme()
    const navigation = useNavigation<composeteAuthRootStack>()
    const dispatch = useAppDispatch()
    
    const signInUser = async () => {
        const responseStaus = await dispatch(SignInAction({
            email: email,
            password: password
        }))

        if (SignInAction.fulfilled.match(responseStaus)) {
            navigation.navigate("UserTab")
        }
    }
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background_color }]}>
            {loading && <Loader />}
            <Image
                source={applogo}
                tintColor={theme.text_color}
                style={styles.imageLogo}
            />
            {error && <Text style={{
                color: "red",
                fontSize: scaledFont(18),
                fontWeight: "bold"
            }}>{error}</Text>}
            <View style={[styles.inputContainer, { backgroundColor: theme.secondary_color, }]}>
                <TextInput
                    secureTextEntry={false}
                    autoCapitalize={"none"}
                    value={email}
                    onChangeText={text => setEmail(text)}
                    placeholderTextColor={theme.placeholder_color}
                    placeholder={"email ..."}
                    style={[styles.input, { color: theme.text_color }]}
                />
            </View>
            <View style={[styles.inputContainer, { backgroundColor: theme.secondary_color, }]} >
                <TextInput
                    secureTextEntry
                    textContentType='password'
                    value={password}
                    onChangeText={text => setPassword(text)}
                    placeholderTextColor={theme.placeholder_color}
                    placeholder={"password ..."}
                    style={[styles.input, { color: theme.text_color }]}
                />
            </View>
            <TouchableOpacity
                onPress={() => signInUser()}
                style={[styles.btnSignIn, { backgroundColor: theme.primary_color, }]}
            >
                <Text style={styles.textSignIn}>Sign In</Text>
            </TouchableOpacity>
            <View style={styles.rowContainer}>
                <Text style={{ color: theme.text_color, fontSize: scaledFont(12) }}>Dont have any account ? </Text>
                <Pressable onPress={() => navigation.navigate("SignUp")}>
                    <Text
                        style={[styles.txtRegister, { color: theme.text_color }]}
                    >Regsiter Here</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}
export default SignIn
const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    imageLogo:
    {
        height: scaledFont(50),
        width: scaledFont(50),
        marginVertical: 10
    },
    inputContainer:
    {
        flexDirection: "row",
        padding: 15,
        width: width * 90 / 100,
        borderRadius: 10,
        marginVertical: 20
    },
    input:
    {
        flex: 1,
        padding: 5,
        fontSize: scaledFont(12)
    },
    btnSignIn:
    {
        width: width * 90 / 100,
        padding: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20
    },
    textSignIn:
    {
        fontSize: scaledFont(18),
        color: "white",
        fontWeight: "bold"
    },
    rowContainer:
    {
        flexDirection: 'row'
    },
    txtRegister:
    {
        textDecorationLine: "underline",
        fontSize: scaledFont(12)
    }
})
import React, { useRef, useState } from 'react'
import { View, Text, SafeAreaView, Dimensions, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AuthStackType } from '../../navigations/AuthStack';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { BASE_URL } from '../../globals/constants';
const OtpVerification = () => {
    const [otp, setOtp] = useState<string>("")
    const [otpArrary, setOtpArray] = useState(["", "", "", "", "", ""])
    const route = useRoute<RouteProp<AuthStackType, "OtpVerification">>()
    const email = "mpgohilse@gmail.com"
    const otpRef = useRef<any[]>([])
    const navigation = useNavigation<NavigationProp<AuthStackType, "OtpVerification">>()
    const changeOTP = (value: string, index: number) => {
        if (value && index < otpRef.current.length - 1) {
            otpRef.current[index + 1].focus()
        }
        if (index == otpRef.current.length - 1) {
            otpRef.current[index].blur()
        }
        const newOtpArr = otpArrary
        newOtpArr[index] = value
        let newOtpString = ""
        newOtpArr.forEach(function (child: string) {
            newOtpString += child
        })
        setOtpArray(newOtpArr)
        setOtp(newOtpString)
    }

    const previousFocus = (key: any, index: number) => {
        console.log(key)
        if (key != 'Backspace' || index == 0) {
            return false
        }
        otpRef.current[index - 1].focus()
        const newOtpArr = otpArrary
        otpArrary[index] = ""
        let newOtpString = ""
        otpArrary.forEach(function (child: string) {
            newOtpString += child
        })
        setOtpArray(newOtpArr)
        setOtp(newOtpString)
    }

    const verifyOtp = async () => {
        try {
            const regex = /^[0-9]+$/;
            if (otp.length != 6 || !regex.test(otp)) {
                return
            }
            console.log(email, otp)

            const result = await axios.post(`${BASE_URL}verify`, {
                headers: { 'Content-Type': 'application/json' },
                body: {
                    email: email,
                    otp: otp
                }
            })
            console.log(result.data)
            navigation.navigate("SignIn")
        }
        catch (err) {
            console.log(JSON.stringify(err))
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <FontAwesome5Icon
                    onPress={() => navigation.goBack()}
                    name='angle-left'
                    color={"black"}
                    size={20}
                />
                <Text style={styles.txtHeader}>otp verification</Text>
                <View />
            </View>
            <View style={styles.otpContainer}>
                <View style={styles.rowContainer}>
                    {
                        otpArrary.map((val, index) => (
                            <TextInput
                                key={index.toString()}
                                ref={(ref: any) => { otpRef.current[index] = ref }}
                                onChangeText={(text: string) => changeOTP(text, index)}
                                onKeyPress={(event) => previousFocus(event.nativeEvent.key, index)}
                                textContentType="oneTimeCode"
                                keyboardType="numeric"
                                value={val}
                                maxLength={1}
                                style={styles.inputOtp}
                            />
                        ))
                    }
                </View>
                <TouchableOpacity
                    onPress={() => verifyOtp()}
                    style={styles.btnVerify}
                >
                    <Text style={styles.textVerify}>Verify</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
export default OtpVerification
const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        //  alignItems:"center",
    },
    headerContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
    txtHeader:
    {
        fontSize: 20,
        fontWeight: "bold",
        color: "black"
    },
    otpContainer:
    {
        flex: 1,
        justifyContent: "center"
    },
    rowContainer:
    {
        flexDirection: 'row',
        padding: 20,
        width: "100%",
        justifyContent: 'space-between'
    },
    inputOtp:
    {
        fontSize: 18,
        height: 50,
        backgroundColor: "#E5E5E5",
        alignSelf: "center",
        textAlign: "center",
        width: 50,
        borderRadius: 15,
        color: "black",
        fontWeight: "bold",
        borderWidth: 1
    },
    btnVerify:
    {
        margin: 20,
        width: "90%",
        backgroundColor: "black",
        marginTop: 40,
        padding: 20,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    textVerify:
    {
        fontSize: 20,
        color: "white",
        fontWeight: "bold"
    }

})
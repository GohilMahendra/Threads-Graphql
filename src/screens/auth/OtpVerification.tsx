import React, { useRef, useState } from 'react'
import { View, Text, SafeAreaView, Dimensions, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { NavigationProp, RouteProp, CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { AuthStackType } from '../../navigations/AuthStack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { BASE_URL } from '../../globals/constants';
import { useAppDispatch } from '../../redux/store';
import { verifyOtpUserAction } from '../../redux/slices/UserSlice';
const OtpVerification = () => {
    const [otp, setOtp] = useState<string>("")
    const [otpArrary, setOtpArray] = useState(["", "", "", "", "", ""])
    const route = useRoute<RouteProp<AuthStackType, "OtpVerification">>()
    const email = "mpgohilse@gmail.com"
    const dispatch = useAppDispatch()
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
        const fullfilled = await dispatch(verifyOtpUserAction({
            email: email,
            otp: otp
        }))
        if(verifyOtpUserAction.fulfilled.match(fullfilled))
        {
            navigation.dispatch({
                ...CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'AuthStack' }],
                }),
            })
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <FontAwesome
                    onPress={() => navigation.goBack()}
                    name='angle-left'
                    color={"black"}
                    size={25}
                />
                <Text style={styles.txtHeader}>OTP Verification</Text>
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
        alignItems:"center",
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
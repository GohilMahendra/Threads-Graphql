import { View, Text, SafeAreaView, TextInput, Image, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native'
import React, { useMemo, useRef, useState } from 'react'
import { placeholder_image } from '../../globals/asstes'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../redux/store'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { ProfileStacktype } from '../../navigations/ProfileStack'
import {
    launchImageLibrary
} from "react-native-image-picker"
import { UpdateAction } from '../../redux/slices/UserSlice'
import { updateUser } from '../../apis/UserAPI'
const { height, width } = Dimensions.get("screen")
const EditProfile = () => {

    const disptach = useAppDispatch()
    type MediaType =
        {
            name: string,
            uri: string,
            type: string
        }

    const user = useSelector((state: RootState) => state.User.user)
    const image = user.profile_picture
    const name = user.fullname
    const user_bio = user.bio

    const [ProfilePicture, setProfilePicture] = useState<MediaType>({
        uri: image || "",
        name: "",
        type: ""
    })
    const [bio, setBio] = useState<string>(user_bio || "")
    const [fullname, setFullName] = useState<string>(name)
    const navigation = useNavigation<NavigationProp<ProfileStacktype, "EditProfile">>()

    const openImagePicker = async () => {
        const response = await launchImageLibrary({
            mediaType: "photo",
            selectionLimit: 1
        })

        if (!response.didCancel) {
            if (response?.assets && response.assets.length > 0) {
                let fileUri = response.assets[0].uri || "";
                if (Platform.OS === "ios" && fileUri.startsWith("file://")) {
                    fileUri = fileUri.substring(7); // Remove "file://" prefix
                }
                console.log(fileUri)
                setProfilePicture({
                    name: response.assets[0].fileName || "",
                    type: response.assets[0].type || "",
                    uri: fileUri || ""
                });
            }
        }
    }

    const updateProfile =async () =>
    {
        // disptach(UpdateAction({
        //     bio:bio,
        //     fullname: fullname,
        //     profile_picture: ProfilePicture
        // }))
       await updateUser({
                bio:bio,
                fullname: fullname,
                profile_picture: ProfilePicture
            })
    }

    return (
        <SafeAreaView style={{
            flex: 1

        }}>
            <View style={{
                flex: 1
            }}>
                <View style={{
                    padding: 20,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBlockColor: "silver"
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <AntDesign
                            onPress={() => navigation.goBack()}
                            name='close'
                            size={20}
                            color={"black"}
                        />
                        <Text style={{
                            fontSize: 18,
                            marginLeft: 30
                        }}>Edit Profile</Text>
                    </View>
                    <TouchableOpacity 
                    onPress={()=>updateProfile()}
                    >
                        <Text style={{
                            fontSize: 18,
                            color:(user.profile_picture == ProfilePicture.uri && 
                                user.fullname == fullname && user.bio == bio)?"silver":"black"
                        }}>Done</Text>
                    </TouchableOpacity>
                </View>
                <View style={{
                    flex: 1,
                    padding: 20,
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        onPress={() => openImagePicker()}
                        style={{
                            alignItems: "center",
                            alignSelf: "center"
                        }}>
                        <Image
                            source={ProfilePicture.uri ? { uri: ProfilePicture.uri } : placeholder_image}
                            style={{
                                height: 70,
                                width: 70,
                                borderRadius: 70
                            }}
                        />
                    </TouchableOpacity>
                    <View style={{
                        flexDirection: "row",
                        padding: 15,
                        backgroundColor: "#E5E5E5",
                        width: width * 90 / 100,
                        borderRadius: 10,
                        marginVertical: 20
                    }}>
                        <TextInput
                            autoCapitalize={"none"}
                            value={fullname}
                            onChangeText={text => setFullName(text)}
                            placeholderTextColor={"grey"}
                            placeholder={"full name ..."}
                            style={{
                                flex: 1,
                                padding: 5,
                            }}
                        />
                    </View>
                    <View style={{
                        flexDirection: "row",
                        padding: 15,
                        backgroundColor: "#E5E5E5",
                        width: width * 90 / 100,
                        borderRadius: 10,
                        marginVertical: 10
                    }}>
                        <TextInput
                            value={bio}
                            multiline={true}

                            numberOfLines={5}
                            onChangeText={text => setBio(text)}
                            placeholderTextColor={"grey"}
                            placeholder={"bio ..."}
                            style={{
                                flex: 1,
                                textAlignVertical: "top",
                                padding: 5,
                                height: 150
                            }}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
export default EditProfile
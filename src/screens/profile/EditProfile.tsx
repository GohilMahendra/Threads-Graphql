import { View, Text, SafeAreaView, TextInput, Image, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native'
import React, { useState } from 'react'
import { placeholder_image } from '../../globals/asstes'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../redux/store'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { ProfileStacktype } from '../../navigations/ProfileStack'
import {
    launchImageLibrary
} from "react-native-image-picker"
import { UpdateAction } from '../../redux/actions/UserActions'
import UseTheme from '../../globals/UseTheme'
import Loader from '../../components/global/Loader'
import { ScrollView } from 'react-native'
import { scaledFont } from '../../globals/utilities'
import { UploadMedia } from '../../types/Post'
const { height, width } = Dimensions.get("screen")
const EditProfile = () => {

    const disptach = useAppDispatch()
    const user = useSelector((state: RootState) => state.User.user)
    const loading = useSelector((state: RootState) => state.User.loading)
    const image = user.profile_picture
    const name = user.fullname
    const user_bio = user.bio
    const { theme } = UseTheme()
    const [ProfilePicture, setProfilePicture] = useState<UploadMedia>({
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
                setProfilePicture({
                    name: response.assets[0].fileName || "",
                    type: response.assets[0].type || "",
                    uri: fileUri || ""
                });
            }
        }
    }

    const updateProfile = async () => {
        disptach(UpdateAction({
            bio: bio,
            fullname: fullname,
            profile_picture: ProfilePicture
        }))
    }

    return (
        <SafeAreaView style={[styles.container, {
            backgroundColor: theme.background_color
        }]}>
            {loading && <Loader />}
            <ScrollView
                contentContainerStyle={{ flex: 1 }}
                style={styles.innerContainer}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerInnerContainer}>
                        <AntDesign
                            onPress={() => navigation.goBack()}
                            name='close'
                            size={scaledFont(20)}
                            color={theme.text_color}
                        />
                        <Text style={[styles.txtHeader, { color: theme.text_color }]}>Edit Profile</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => updateProfile()}
                    >
                        <Text style={{
                            fontSize: scaledFont(18),
                            color: (user.profile_picture == ProfilePicture.uri &&
                                user.fullname == fullname && user.bio == bio) ? "silver" : theme.text_color
                        }}>Done</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.editContainer}>
                    <TouchableOpacity
                        onPress={() => openImagePicker()}
                        style={styles.btnImage}>
                        <Image
                            source={ProfilePicture.uri ? { uri: ProfilePicture.uri } : placeholder_image}
                            style={styles.imageUser}
                        />
                    </TouchableOpacity>
                    <View style={[styles.nameContainer, {
                        backgroundColor: theme.secondary_background_color
                        , borderWidth: 0.5
                    }]}>
                        <TextInput
                            autoCapitalize={"none"}
                            value={fullname}
                            onChangeText={text => setFullName(text)}
                            placeholderTextColor={theme.placeholder_color}
                            placeholder={"full name ..."}
                            style={[styles.inputFullname, { color: theme.text_color }]}
                        />
                    </View>
                    <View style={[styles.bioContainer, { backgroundColor: theme.secondary_background_color, borderWidth: 0.5 }]}>
                        <TextInput
                            value={bio}
                            multiline={true}
                            numberOfLines={5}
                            onChangeText={text => setBio(text)}
                            placeholderTextColor={theme.placeholder_color}
                            placeholder={"bio ..."}
                            style={[styles.inputBio, {
                                color: theme.text_color,
                            }]}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default EditProfile
const styles = StyleSheet.create({
    container:
    {
        flex: 1
    },
    innerContainer:
    {
        flex: 1
    },
    headerContainer:
    {
        padding: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBlockColor: "silver"
    },
    headerInnerContainer:
    {
        flexDirection: 'row',
        alignItems: 'center'
    },
    txtHeader:
    {
        fontSize: scaledFont(18),
        marginLeft: 30,
    },
    editContainer:
    {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
    },
    btnImage:
    {
        alignItems: "center",
        alignSelf: "center"
    },
    imageUser:
    {
        height: scaledFont(70),
        width: scaledFont(70),
        borderRadius: scaledFont(70)
    },
    nameContainer:
    {
        flexDirection: "row",
        padding: 15,
        width: width * 90 / 100,
        borderRadius: 10,
        marginVertical: 20
    },
    inputFullname:
    {
        flex: 1,
        padding: 5,
    },
    bioContainer:
    {
        flexDirection: "row",
        padding: 15,
        width: width * 90 / 100,
        borderRadius: 10,
        marginVertical: 10
    },
    inputBio:
    {
        flex: 1,
        textAlignVertical: "top",
        padding: scaledFont(5),
        height: scaledFont(150)
    }
})
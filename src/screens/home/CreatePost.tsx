import {
    View, Text, Image, TextInput,
    SafeAreaView, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, StyleSheet
} from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { placeholder_image } from '../../globals/asstes'
import { launchImageLibrary } from "react-native-image-picker";
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux/store';
import UseTheme from '../../globals/UseTheme';
import Loader from '../../components/global/Loader';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackType } from '../../navigations/RootStack';
import { createPostAction } from '../../redux/actions/UserActions';
import { UploadMedia } from '../../types/Post';
import { CHARACTER_LIMIT } from '../../globals/constants';
import { scaledFont } from '../../globals/utilities'

const CreatePost = () => {

    const navigation = useNavigation<NavigationProp<RootStackType, "CreatePost">>()
    const [content, setContent] = useState<string>("")
    const [media, setMedia] = useState<UploadMedia[]>([])
    const user = useSelector((state: RootState) => state.User.user)
    const loading = useSelector((state: RootState) => state.User.loading)
    const { theme } = UseTheme()
    const dispatch = useAppDispatch()
    const removeItem = (path: string) => {
        const filtred_Item: UploadMedia[] = media.filter((item) => item.uri != path)
        setMedia(filtred_Item)
    }
    const createPost = async () => {
        if (!content && media.length == 0)
            return

        try {
            const fullfield = await dispatch(createPostAction({
                media: media,
                content: content
            }))

            if (createPostAction.fulfilled.match(fullfield)) {
                navigation.goBack()
            }

        }
        catch (err) {
            console.log(JSON.stringify(err))
        }
    }

    const openImagePicker = async () => {
        const response = await launchImageLibrary({
            mediaType: "mixed",
            selectionLimit: 4,
        })

        if (!response.didCancel) {
            if (response.assets) {
                const assets: UploadMedia[] = []
                response.assets.forEach((item) => {
                    const media: UploadMedia = {
                        type: item.type ?? "",
                        name: item.fileName ?? "",
                        uri: item.uri ?? ""
                    }
                    assets.push(media)
                })
                setMedia(assets)
            }
        }
    }
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.secondary_background_color }]}>
            {loading && <Loader />}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.containerAvoidingView}>
                {/* header starts*/}
                <View style={styles.headerContainer}>
                    <AntDesign
                        onPress={() => navigation.goBack()}
                        name='close'
                        size={scaledFont(20)}
                        color={theme.text_color}
                    />
                    <Text style={[styles.txtHeader, { color: theme.text_color }]}>Create Threads</Text>
                    <TouchableOpacity
                        onPress={() => createPost()}
                        style={[styles.btnPost, { backgroundColor: theme.primary_color, }]}>
                        <Text style={styles.txtPost}>Post</Text>
                    </TouchableOpacity>
                </View>
                {/* header ends */}
                <View style={styles.contentContainer}>
                    <Image
                        resizeMode='cover'
                        source={user.profile_picture ? { uri: user.profile_picture } : placeholder_image}
                        style={styles.imgUser}
                    />
                    <View style={styles.rightContainer}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={content}
                                onChangeText={(text: string) => setContent(text)}
                                placeholder={"What's on your mind?"}
                                placeholderTextColor={theme.placeholder_color}
                                multiline={true}
                                maxLength={CHARACTER_LIMIT}
                                style={[styles.input, { color: theme.text_color, }]}
                            />
                            <AntDesign
                                onPress={() => setContent("")}
                                name='close'
                                size={ scaledFont(15)}
                                color={theme.text_color}
                            />
                        </View>
                        <View style={styles.mediaContainer}>
                            {
                                media.length == 0
                                    ?
                                    <MaterialIcons
                                        onPress={() => openImagePicker()}
                                        name='photo-library'
                                        size={ scaledFont(25)}
                                        color={theme.text_color}
                                    />
                                    :
                                    media.map((item) => (
                                        <View
                                            style={styles.imageContainer}
                                            key={item.uri}>
                                            <Image
                                                source={{ uri: item.uri }}
                                                style={styles.imageThumb}
                                            />
                                            <TouchableOpacity
                                                style={[styles.closeContainer, {
                                                    backgroundColor: theme.primary_color, padding: 2,
                                                }]}
                                            >
                                                <AntDesign
                                                    onPress={() => removeItem(item.uri)}
                                                    name='close'
                                                    size={scaledFont(15)}
                                                    color={"white"}
                                                />
                                            </TouchableOpacity>
                                            {item.type.includes("video") && <FontAwesome
                                                style={styles.iconPlay}
                                                name='play'
                                                color={"white"}
                                                size={scaledFont(15)}
                                            />
                                            }
                                        </View>
                                    )
                                    )
                            }
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default CreatePost
const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    containerAvoidingView:
    {
        flex: 1,
        padding: 10
    },
    headerContainer:
    {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
    },
    txtHeader:
    {
        fontSize: scaledFont(15),
        textAlign: 'center'
    },
    btnPost:
    {
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
    },
    txtPost:
    {
        color: "white",
        fontWeight: "bold",
        fontSize:scaledFont(15)
    },
    contentContainer:
    {
        flexDirection: 'row',
        marginVertical: 20,
        alignItems: 'flex-start'
    },
    imgUser:
    {
        height: scaledFont(40),
        width:  scaledFont(40),
        borderRadius:  scaledFont(40),
        marginRight:  scaledFont(10)
    },
    rightContainer:
    {
        width: "80%",
    },
    inputContainer:
    {
        padding: 15,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    input:
    {
        textAlignVertical: "top",
        maxHeight: 200,
        flex: 1,
        fontSize: scaledFont(13),
        marginRight: 20
    },
    mediaContainer:
    {
        flexDirection: 'row',
        marginTop: 20,
        flexWrap: 'wrap'
    },
    imageContainer:
    {
        marginBottom: 10,
        marginRight: 10
    },
    imageThumb:
    {
        height: scaledFont(70),
        width: scaledFont(70),
        borderRadius: 15
    },
    closeContainer:
    {
        position: "absolute",
        right: -2,
        borderRadius: 10,
        top: -5
    },
    iconPlay:
    {
        position: 'absolute',
        top: "40%",
        alignSelf: 'center'
    }
})
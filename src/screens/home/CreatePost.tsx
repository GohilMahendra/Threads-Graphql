import {
    View, Text, Image, TextInput,
    SafeAreaView, TouchableOpacity, Dimensions
} from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { placeholder_image } from '../../globals/asstes'
import { launchImageLibrary } from "react-native-image-picker";
import axios from 'axios';
import { BASE_URL } from '../../globals/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { height, width } = Dimensions.get("screen")

type assetType = {
    name: string,
    uri: string,
    type: String
}
const CreatePost = () => {

    const [content, setContent] = useState<string>("")
    const [media, setMedia] = useState<assetType[]>([])
    const user = useSelector((state: RootState) => state.User.user)
    const removeItem = (path: string) => {
        const filtred_Item: assetType[] = media.filter((item) => item.uri != path)
        setMedia(filtred_Item)
    }

    const extractTags = (contentText: string) => {
        const words = contentText.split(" ")
        const hastags = words.filter((item) => (item[0] == "#"))
        return hastags
    }

    const getToken = async () => {
        const token = await AsyncStorage.getItem("token")
        return token
    }

    const createPost = async () => {
        if (!content && media.length == 0)
            return

        try {
            const hastags = extractTags(content)
            const token = await getToken()
            let formData = new FormData()
            formData.append("content", content)
            formData.append("is_repost", false)
            if (hastags.length > 0) {
                hastags.forEach((tag, index) => {
                    formData.append("hashtags", tag)
                })
            }
            if (media.length > 0) {
                media.forEach((file, index) => {
                    formData.append(`media`, file)
                })
            }
            console.log(JSON.stringify(formData))
            const upload_post = await axios.post(BASE_URL + "posts",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'token': token
                    }
                }
            )
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
                const assets: assetType[] = []
                response.assets.forEach((item) => {
                    const media: assetType = {
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

    useEffect(() => {
        if (media.length > 0)
            console.log(media)
    }, [media])
    return (
        <SafeAreaView style={{
            flex: 1,
        }}>
            <View style={{
                flex: 1,
                padding: 10
            }}>
                {/* header starts*/}
                <View style={{
                    flexDirection: 'row',
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <FontAwesome5Icon
                        name='angle-left'
                        size={20}
                        color={"black"}
                    />
                    <TouchableOpacity
                        onPress={() => createPost()}
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            backgroundColor: "black",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 15,
                        }}>
                        <Text style={{
                            color: "white",

                        }}>Post</Text>
                    </TouchableOpacity>
                </View>
                {/* header ends */}

                <View style={{
                    flexDirection: 'row',
                    marginVertical: 20
                }}>
                    <Image
                        source={placeholder_image}
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 40,
                            marginRight: 10
                        }}
                    />
                    <View style={{
                        width: "80%"
                    }}>
                        <View style={{
                            padding: 15,
                            borderRadius: 15,
                            backgroundColor: "#fff",
                            height: 150,
                        }}>
                            <TextInput
                                value={content}
                                onChangeText={(text: string) => setContent(text)}
                                placeholder={"Whats going here ..."}
                                placeholderTextColor={"grey"}
                                multiline={true}
                                numberOfLines={5}
                                style={{
                                    textAlignVertical: "top"
                                }}
                            />
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 20
                        }}>
                            {
                                media.length == 0
                                    ?
                                    <FontAwesome5Icon
                                        onPress={() => openImagePicker()}
                                        name='image'
                                        size={20}
                                        color={"black"}
                                    />
                                    :
                                    media.map((item) => (
                                        <View
                                            style={{
                                                marginRight: 10
                                            }}
                                            key={item.uri}>
                                            <Image
                                                source={{ uri: item.uri }}
                                                style={{
                                                    height: 70,
                                                    width: 70,
                                                    borderRadius: 15
                                                }}
                                            />
                                            <FontAwesome5Icon
                                                onPress={() => removeItem(item.uri)}
                                                name='times'
                                                size={15}
                                                color={"black"}
                                                style={{
                                                    position: "absolute",
                                                    right: -2,
                                                    top: -5
                                                }}
                                            />
                                        </View>
                                    ))
                            }
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default CreatePost
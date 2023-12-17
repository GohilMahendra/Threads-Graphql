import React from "react";
import { Text, Image, TouchableOpacity, Dimensions } from "react-native"
import { View } from "react-native"
import { placeholder_image } from "../../globals/asstes";
import GridViewer from "./GridViewer";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import { Media, Thread } from "../../types/Post";
import { timeDifference } from "../../globals/utilities";
import { useDispatch } from "react-redux";
import { useAppDispatch } from "../../redux/store";
import { LikeAction } from "../../redux/slices/FeedSlice";
const { height, width } = Dimensions.get("screen")

const cardWidth = width - 40
type PostItemsProps =
    {
        post: Thread
    }
const PostItem = (props: PostItemsProps) => {

    const post = props.post
    const images = post.media

    const getMediasource = (media: Media) => {
        if (media.media_type.includes("video"))
            return media.thumbnail
        else
            return media.media_url
    }

    const dispatch = useAppDispatch()
    const LikePost = () => {
        dispatch(LikeAction({ postId: post._id }))
    }
    console.log(JSON.stringify(post.media))
    return (
        <View style={{
            padding: 10,
            backgroundColor: "#fff",
            flexDirection: "row",
            borderRadius: 15,
            width: '100%',
        }}>
            <View style={{
                flexDirection: 'row',
            }}>
                <View style={{
                    marginRight: 20,
                }}>
                    <Image
                        source={post.user.profile_picture ? {
                            uri: post.user.profile_picture
                        } : placeholder_image}
                        style={{
                            height: 50,
                            width: 50,
                            borderRadius: 50
                        }}
                    />
                </View>
            </View>

            <View style={{
                //  alignItems: 'center',
                width: "80%",
            }}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: 'space-between'
                }}>
                    <Text style={{
                        color: "black",
                        fontSize: 18,
                        fontWeight: "bold",
                    }}>{post.user.fullname}</Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            color: "silver",
                            marginRight: 20
                        }}>{timeDifference(post.created_at)}</Text>
                        <Entypo
                            name="dots-three-horizontal"
                            size={18}
                            color={"black"}
                        />
                    </View>
                </View>
                <Text>{post.content}</Text>

                <View style={{
                    marginVertical: 5
                }}>
                    {
                        images.length == 1
                        &&
                        <TouchableOpacity>
                            <Image
                                source={{ uri: getMediasource(images[0]) }}
                                style={{
                                    height: 200,
                                    borderRadius: 15,
                                    width: "100%"
                                }}
                            />
                        </TouchableOpacity>
                    }
                    {
                        images.length == 2
                        &&
                        <View style={{
                           // flexDirection: 'row',
                            flexWrap: "wrap"
                        }}>
                            {
                                images.map((image, index) => (
                                    <TouchableOpacity key={image._id}>
                                        <Image
                                            resizeMode="contain"
                                            source={{ uri: getMediasource(image) }}
                                            style={{
                                                height: 200,
                                                borderRadius: 15,
                                                width: "100%"
                                            }}
                                        />
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                    }
                    {
                        images.length == 3
                        &&
                        <View style={{
                            flexDirection: 'row',
                        }}>
                            <TouchableOpacity>
                                <Image
                                    source={{ uri: getMediasource(images[0]) }}
                                    style={{
                                        height: 200,
                                        borderRadius: 15,
                                        width: "100%"
                                    }}
                                />
                            </TouchableOpacity>
                            <View>
                                {images.map((image, index) => (
                                    index != 0 && <TouchableOpacity>
                                        <Image
                                            source={{ uri: getMediasource(image) }}
                                            style={{
                                                height: 200,
                                                borderRadius: 15,
                                                width: "100%"
                                            }}
                                        />
                                    </TouchableOpacity>
                                ))
                                }
                            </View>
                        </View>
                    }
                    {
                        images.length == 4
                        &&
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: "wrap"
                        }}>
                            {
                                images.map((image, index) => (
                                    <TouchableOpacity>
                                        <Image
                                            source={{ uri: getMediasource(image) }}
                                            style={{
                                                height: 100,
                                                borderRadius: 15,
                                                width: "50%"
                                            }}
                                        />
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                    }

                </View>

                <View style={{
                    flexDirection: 'row',
                    marginVertical: 5
                }}>
                    <FontAwesome
                        onPress={() => LikePost()}
                        name={(post.isLiked) ? "heart" : "heart-o"}
                        style={{ marginRight: 20 }}
                        size={20}

                        color={"black"}
                    />
                    <FontAwesome
                        name="comment-o"
                        style={{ marginRight: 20 }}
                        size={20}
                        color={"black"}
                    />
                    <AntDesign
                        name="retweet"
                        style={{ marginRight: 20 }}
                        size={20}
                        color={"black"}
                    />
                    <Feather
                        name="send"
                        size={20}
                        color={"black"}
                    />
                </View>

            </View>
        </View>

    )

}
export default PostItem
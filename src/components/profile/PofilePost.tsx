import React, { useCallback, useMemo, useRef } from "react";
import { Text, Image, TouchableOpacity, Dimensions } from "react-native"
import { View } from "react-native"
import { placeholder_image } from "../../globals/asstes";
import Entypo from "react-native-vector-icons/Entypo";
import { Media, Thread } from "../../types/Post";
import { getMediaImage, timeDifference } from "../../globals/utilities";
import GridViewer from "../feed/GridViewer";
const { height, width } = Dimensions.get("screen")
type PostItemsProps =
    {
        post: Thread,
        onPressThreeDots:(postId:string)=>void
    }
const ProfilePost = (props: PostItemsProps) => {

    const post = props.post
    const media = post.media

    return (
        <View style={{
            padding: 10,
            backgroundColor: "#fff",
            flexDirection: "row",
            borderRadius: 15,
            alignSelf: 'center',
            margin: 10
        }}>
            <View style={{
                flexDirection: 'row',
            }}>
                <View style={{
                    marginRight: 20,
                }}>
                    <Image
                        resizeMode="cover"
                        source={post.user.profile_picture ? {
                            uri: post.user.profile_picture
                        } : placeholder_image}
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 40
                        }}
                    />
                </View>
            </View>

            <View style={{
                //  alignItems: 'center',
                width: "90%",
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
                            onPress={()=>props.onPressThreeDots(post._id)}
                            name="dots-three-horizontal"
                            size={18}
                            color={"black"}
                        />
                    </View>
                </View>
                <Text>{post.content}</Text>

                <GridViewer
                media={media}
                />

            </View>
        </View>

    )

}
export default ProfilePost
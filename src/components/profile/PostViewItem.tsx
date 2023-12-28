import React from "react";
import { Text, Image, Dimensions } from "react-native"
import { View } from "react-native"
import { placeholder_image } from "../../globals/asstes";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import { Thread } from "../../types/Post";
import { timeDifference } from "../../globals/utilities";
import GridViewer from "../feed/GridViewer";
import UseTheme from "../../globals/UseTheme";
type PostItemsProps =
    {
        post: Thread
    }
const PostViewItem = (props: PostItemsProps) => {

    const post = props.post
    const media = post.media
    const { theme } = UseTheme()

    return (
        <View style={{
            padding: 10,
            backgroundColor: theme.background_color,
            flexDirection: "row",
            borderRadius: 15,
            alignSelf: 'center',
            margin: 10,

        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: "center"
            }}>
                <View style={{
                    marginRight: 20,
                    alignItems: "center"
                }}>
                    <View
                    >
                        <Image
                            resizeMode="cover"
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
                <View
                    style={{
                        position: 'absolute',
                        top: 60,
                        bottom: 0,
                        //alignSelf: "center", 
                        width: 1,
                        backgroundColor: 'silver',
                    }}
                />
            </View>

            <View style={{
                //  alignItems: 'center',
                width: "80%",
            }}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: 'space-between'
                }}>
                    <View>
                        <Text style={{
                            color: theme.text_color,
                            fontSize: 18,
                            fontWeight: "bold",
                        }}>{post.user.fullname}</Text>
                        <Text style={{
                            color: theme.text_color,
                            fontSize: 15,
                        }}>{post.user.username}</Text>
                    </View>
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
                            color={theme.text_color}
                        />
                    </View>
                </View>
                <Text style={{
                    color: theme.text_color
                }}>{post.content}</Text>

                <GridViewer
                    media={media}
                />
            </View>
        </View>

    )

}
export default PostViewItem
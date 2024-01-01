import React from "react";
import { Text, Image, TouchableOpacity, Dimensions, StyleSheet } from "react-native"
import { View } from "react-native"
import { placeholder_image } from "../../globals/asstes";
import Entypo from "react-native-vector-icons/Entypo";
import { Thread } from "../../types/Post";
import { scaledFont, timeDifference } from "../../globals/utilities";
import GridViewer from "../feed/GridViewer";
import UseTheme from "../../globals/UseTheme";
import PressableContent from "../feed/PressableContent";
type PostItemsProps =
    {
        post: Thread,
        onPressThreeDots: (postId: string) => void
        onPressNavigate: (userId: string) => void
    }
const PostItem = (props: PostItemsProps) => {

    const post = props.post
    const media = post.media
    const { theme } = UseTheme()

    return (
        <View style={[styles.container, { backgroundColor: theme.background_color, }]}>
            <View style={styles.rowContainer}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={() => props.onPressNavigate(post.user._id)}>
                        <Image
                            resizeMode="cover"
                            source={post.user.profile_picture ? {
                                uri: post.user.profile_picture
                            } : placeholder_image}
                            style={styles.userImage}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.profileRode} />
            </View>
            <View style={styles.rightContainer}>
                <View style={styles.profileRowContainer}>
                    <View>
                        <Text style={[styles.txtUsername, { color: theme.text_color, }]}>{post.user.username}</Text>
                    </View>
                    <View style={styles.rightProfileContainer}>
                        <Text style={styles.txtCreatedAt}>{timeDifference(post.created_at)}</Text>
                        <Entypo
                            onPress={() => props.onPressThreeDots(post._id)}
                            name="dots-three-horizontal"
                            size={scaledFont(18)}
                            color={theme.text_color}
                        />
                    </View>
                </View>
                {post.content && <PressableContent
                    content={post.content}
                    onPressHashTag={(tag: string) => console.log(tag)}
                />}
                <GridViewer
                    media={media}
                />
                {
                    (post.replies > 0 || post.likes > 0)
                    &&
                    <View style={styles.rowLikeComments}>
                        <Text style={[styles.textComments, { color: theme.secondary_text_color }]}>{post.replies} comments</Text>
                        <Text style={[styles.textLikes, { color: theme.secondary_text_color }]}>{post.likes} Likes</Text>
                    </View>
                }
            </View>
        </View>
    )
}
export default PostItem
const styles = StyleSheet.create({
    container:
    {
        padding: 10,
        flexDirection: "row",
        borderRadius: 15,
        alignSelf: 'center',
        margin: 10,
    },
    rowContainer:
    {
        flexDirection: 'row',
        justifyContent: "center"
    },
    imageContainer:
    {
        marginRight: 20,
        alignItems: "center"
    },
    userImage:
    {
        height: scaledFont(50),
        width: scaledFont(50),
        borderRadius: scaledFont(50)
    },
    profileRode:
    {
        position: 'absolute',
        top: 60,
        bottom: 0,
        width: 1,
        backgroundColor: 'silver',
    },
    rightContainer:
    {
        width: "80%",
    },
    profileRowContainer:
    {
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    txtFullname:
    {
        fontSize: scaledFont(18),
        fontWeight: "bold",
    },
    txtUsername:
    {
        fontSize: scaledFont(15),
        fontWeight: 'bold'
    },
    rightProfileContainer:
    {
        flexDirection: 'row',
        alignItems: 'center',
    },
    txtCreatedAt:
    {
        color: "silver",
        marginRight: 10,
        fontSize: scaledFont(13)
    },
    rowLikeComments:
    {
        flexDirection: 'row',
    },
    textComments:
    {
        fontSize: scaledFont(13),
        marginRight: 25
    },
    textLikes:
    {
        fontSize: scaledFont(13),
    }
})
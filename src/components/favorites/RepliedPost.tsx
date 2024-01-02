import React, { useState } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { CommentedPost } from "../../types/Comment";
import RepostItem from "../feed/RepostItem";
import PostItem from "../feed/PostItem";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { placeholder_image } from "../../globals/asstes";
import UseTheme from "../../globals/UseTheme";
import { scaledFont, timeDifference } from "../../globals/utilities";
import Entypo from "react-native-vector-icons/Entypo";
type RepliedPostProps =
    {
        commentPost: CommentedPost,
        toggleLike: (postId: string, step: "like" | "unlike") => void
        onReplyThreeDots: (replyId: string) => void
        onPressComment: (postId: string) => void
        onRepostIcon: (postId: string) => void
        onNavigate: (userId:string) => void
    }
const RepliedPost = (props: RepliedPostProps) => {
    const { commentPost } = props
    const post = commentPost.post
    const user = useSelector((state: RootState) => state.User.user)
    const { theme } = UseTheme()
    return (<View >
        {
            (post.Repost && post.isRepost)
                ?
                <RepostItem
                    onLikeToggle={(postId, step) => props.toggleLike(postId, step)}
                    onPressComment={(postId) => props.onPressComment(postId)}
                    onPressNavigate={(userId) => props.onNavigate(userId)}
                    onRepost={(postId) => props.onRepostIcon(postId)}
                    post={post}
                /> :
                <PostItem
                    onLikeToggle={(postId, step) => props.toggleLike(postId, step)}
                    onPressComment={(postId) => props.onPressComment(postId)}
                    onPressNavigate={(userId) =>props.onNavigate(userId)}
                    onRepost={(postId) => props.onRepostIcon(postId)}
                    post={post}
                />
        }
        <View style={[styles.container, { borderColor: theme.text_color, }]}>
            <View style={styles.imageContainer}>
                <Image
                    source={user.profile_picture ? { uri: user.profile_picture } : placeholder_image}
                    style={styles.imgUser}
                />
            </View>
            <View style={styles.rightContainer}>
                <View style={styles.profileRowContainer}>
                    <Text style={{
                        color: theme.text_color,
                        fontWeight: "bold",
                        fontSize: scaledFont(18)
                    }}>{user.username}</Text>
                    <View style={styles.rightRowContainer}>
                        <Text style={{
                            color: theme.secondary_text_color,
                            marginRight: scaledFont(20)
                        }}>1h</Text>
                        <Entypo
                            onPress={() => props.onReplyThreeDots(commentPost._id)}
                            name="dots-three-horizontal"
                            size={scaledFont(20)}
                            color={theme.text_color}
                        />
                    </View>
                </View>
                <Text style={{
                    fontSize: scaledFont(14),
                    marginVertical: 5,
                    color: theme.text_color
                }}>{commentPost.content}</Text>
            </View>
        </View>

    </View>
    )
}
export default RepliedPost
const styles = StyleSheet.create({
    container:
    {
        flexDirection: "row",
        marginHorizontal: 20,
        borderBottomWidth: 0.5,
        paddingBottom: 10
    },
    imageContainer:
    {
        marginRight: 20
    },
    imgUser:
    {
        width: scaledFont(30),
        height: scaledFont(30),
        borderRadius: 30,
    },
    rightContainer:
    {
        width: "80%",
    },
    profileRowContainer:
    {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between"
    },
    rightRowContainer:
    {
        flexDirection: 'row'
    },

})
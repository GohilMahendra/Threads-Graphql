import React from "react";
import { Text, Image, StyleSheet } from "react-native"
import { View } from "react-native"
import { placeholder_image } from "../../globals/asstes";
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
        <View style={[styles.container,{borderColor: theme.secondary_text_color }]}>
            <View style={styles.rowContaniner}>
                <View style={styles.profileContainer}>
                    <View
                    >
                        <Image
                            resizeMode="cover"
                            source={post.user.profile_picture ? {
                                uri: post.user.profile_picture
                            } : placeholder_image}
                            style={styles.imgUser}
                        />
                    </View>
                </View>
                <View
                    style={styles.verticalRode}
                />
            </View>

            <View style={styles.rightContainer}>
                <View style={styles.rightRowContainer}>
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
                    <View style={styles.profileRightContainer}>
                        <Text style={[styles.txtTime, { color: theme.secondary_text_color }]}>{timeDifference(post.created_at)}</Text>
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
const styles = StyleSheet.create({
    container:
    {
        padding: 10,
        flexDirection: "row",
        borderRadius: 15,
        alignSelf: 'center',
        margin: 10,
        borderWidth:0.3,

    },
    rowContaniner:
    {
        flexDirection: 'row',
        justifyContent: "center"
    },
    profileContainer:
    {
        marginRight: 20,
        alignItems: "center"
    },
    imgUser:
    {
        height: 40,
        width: 40,
        borderRadius: 40
    },
    verticalRode:
    {
        position: 'absolute',
        top: 60,
        bottom: 0,
        //alignSelf: "center", 
        width: 1,
        backgroundColor: 'silver',
    },
    rightContainer:
    {
        //  alignItems: 'center',
        width: "80%",
    },
    rightRowContainer:
    {
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    profileRightContainer:
    {
        flexDirection: 'row',
        alignItems: 'center',
    },
    txtTime:
    {
        marginRight: 20
    }

})
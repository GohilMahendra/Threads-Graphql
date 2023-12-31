import React from "react";
import { StyleSheet, Text, View } from "react-native"
import UseTheme from "../../globals/UseTheme"
import { Comment } from "../../types/Comment";
import { scaledFont, timeDifference } from "../../globals/utilities";
import { Image } from "react-native";
import { placeholder_image } from "../../globals/asstes";

type ReplyProps =
    {
        comment: Comment
    }

const ReplyItem = (props: ReplyProps) => {
    const { comment } = props
    const { theme } = UseTheme()
    return (
        <View
            key={comment._id}
            style={[styles.container, { borderColor: theme.secondary_text_color }]}>
            <Image
                source={comment.user.profile_picture ?
                    { uri: comment.user.profile_picture } :
                    placeholder_image
                }
                style={styles.imgUser}
            />
            <View style={styles.rightContainer}>
                <View style={[styles.profileRowContainer]}>
                    <Text style={[styles.textFullname, { color: theme.text_color }]}>{comment.user.fullname}</Text>
                    <View style={styles.timeRowContainer}>
                        <Text style={{
                            color: "silver"
                        }}>{timeDifference(comment.created_at)}</Text>
                    </View>
                </View>
                <Text style={{ color: theme.text_color }}>{comment.content}</Text>
            </View>
        </View>
    )
}
export default ReplyItem
const styles = StyleSheet.create({
    container:
    {
        flexDirection: "row",
        padding: 10,
        elevation: 10,
        borderBottomWidth: 1,
    },
    imgUser:
    {
        height: scaledFont(30),
        width: scaledFont(30),
        alignItems: "flex-start",
        borderRadius: scaledFont(30),
        marginRight: 20
    },
    rightContainer:
    {
        width: "80%",
    },
    profileRowContainer:
    {
        flexDirection: 'row',
        width: "100%",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textFullname:
    {
        fontSize: 15,
        fontWeight: "500",
    },
    timeRowContainer:
    {
        flexDirection: 'row'
    }
})
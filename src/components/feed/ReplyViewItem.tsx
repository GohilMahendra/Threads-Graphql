import React from "react";
import { Comment } from "../../types/Comment"
import { StyleSheet, View } from "react-native";
import { Image } from "react-native-elements";
import UseTheme from "../../globals/UseTheme";
import { placeholder_image } from "../../globals/asstes";
import { Text } from "react-native";
import { timeDifference } from "../../globals/utilities";

type ReplyViewProps =
    {
        comment: Comment,
        onPress: (userId: string) => void
    }

const ReplyViewItem = (props: ReplyViewProps) => {
    const { comment } = props
    const { theme } = UseTheme()
    return (
        <View
            key={comment._id}
            style={[styles.container, { borderColor: theme.secondary_text_color }]}>
            <Image
                onPress={() => props.onPress(comment.user._id)}
                source={comment.user.profile_picture ?
                    { uri: comment.user.profile_picture } :
                    placeholder_image
                }
                style={styles.imgUser}
            />
            <View style={styles.rightContainer}>
                <View style={styles.userRowContainer}>
                    <Text
                        onPress={() => props.onPress(comment.user._id)}
                        style={[styles.txtUsername, { color: theme.text_color }]}>{comment.user.username}</Text>
                    <View style={styles.rightProfileContainer}>
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
export default ReplyViewItem
const styles = StyleSheet.create({
    container:
    {
        flexDirection: "row",
        padding: 10,
        elevation: 10,
        //  alignItems: "center",
        borderBottomWidth: 1
    },
    imgUser:
    {
        height: 30,
        width: 30,
        alignItems: "flex-start",
        borderRadius: 30,
        marginRight: 20
    },
    rightContainer:
    {
        width: "80%",
    },
    userRowContainer:
    {
        flexDirection: 'row',
        width: "100%",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    txtUsername:
    {
        fontSize: 15,
        fontWeight: "500"
    },
    rightProfileContainer:
    {
        flexDirection: 'row'
    }
})
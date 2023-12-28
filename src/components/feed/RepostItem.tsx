import React from "react";
import { Text, Image, TouchableOpacity } from "react-native"
import { View } from "react-native"
import { placeholder_image } from "../../globals/asstes";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import { Thread } from "../../types/Post";
import { timeDifference } from "../../globals/utilities";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    Easing,
    withTiming,
    withSequence,
} from "react-native-reanimated";
import GridViewer from "./GridViewer";
import UseTheme from "../../globals/UseTheme";
import { StyleSheet } from "react-native";
type PostItemsProps =
    {
        post: Thread,
        onPressComment: (postId: string) => void
        onRepost: (postId: string) => void
        onPressNavigate: (userId: string) => void
        onLikeToggle: (postId: string, step: "like" | "unlike") => void
    }
const RepostItem = (props: PostItemsProps) => {

    const post = props.post
    const media = post.media
    const repost = post.Repost as Thread
    const likeAnim = useSharedValue<number>(1)
    const { theme } = UseTheme()
    const startAnimation = () => {
        likeAnim.value = withSequence(
            withTiming(1.5, { duration: 200, easing: Easing.linear }),
            withTiming(1, { duration: 200, easing: Easing.linear })
        );
    }

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: likeAnim.value }],
        };
    });
    const toggeleLike = () => {
        startAnimation()
        if (post.isLiked)
            props.onLikeToggle(post._id, "unlike")
        else
            props.onLikeToggle(post._id, "like")
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background_color, }]}>
            <View style={styles.rowContainer}>
                <View style={styles.profileContainer}>
                    <TouchableOpacity
                        onPress={() => props.onPressNavigate(post.user._id)}
                    >
                        <Image
                            resizeMode="cover"
                            source={post.user.profile_picture ? {
                                uri: post.user.profile_picture
                            } : placeholder_image}
                            style={styles.imageProfile}
                        />
                    </TouchableOpacity>
                    <View style={styles.rodeContainer} />
                </View>
            </View>
            <View style={styles.rightContainer}>
                <View style={styles.profileRowContainer}>
                    <Text style={[styles.txtFullname, { color: theme.text_color }]}>{post.user.username}</Text>
                    <View style={styles.rightRowProfileContainer}>
                        <Text style={styles.txtCreatedAt}>{timeDifference(post.created_at)}</Text>
                        <Entypo
                            name="dots-three-horizontal"
                            size={18}
                            color={theme.text_color}
                        />
                    </View>
                </View>
                <Text style={{color: theme.text_color,marginVertical:5}}>{post.content}</Text>
                {/* origional post container starts */}
                <View style={[styles.postContainer, { borderColor: theme.text_color }]}>
                    <TouchableOpacity
                        onPress={() => props.onPressNavigate(
                            post.Repost?.user._id || ""
                        )}
                        style={styles.profilePostContainer}>

                        <Image
                            style={styles.imgPostProfile}
                            source={post.Repost?.user.profile_picture ?
                                { uri: post.Repost?.user.profile_picture } :
                                placeholder_image
                            }
                        />
                        <View>
                            <Text style={[styles.profileTxtFullname, { color: theme.text_color }]}>{post.Repost?.user.username}</Text>
                        </View>

                    </TouchableOpacity>
                    <Text style={{ color: theme.text_color }}>{post.Repost?.content}</Text>
                    <GridViewer
                        media={post.Repost?.media || []}
                    />
                </View>
                {/* origional post container ends */}
                <View style={styles.actionsRowContainer}>
                    <Animated.View
                        style={[{
                        }, animatedStyle]}>
                        <FontAwesome
                            onPress={() => toggeleLike()}
                            name={(post.isLiked) ? "heart" : "heart-o"}
                            size={20}
                            color={post.isLiked ? "red" : theme.text_color}
                        />
                    </Animated.View>
                    <FontAwesome
                        onPress={() => props.onPressComment(post._id)}
                        name="comment-o"
                        style={{ marginRight: 20, marginLeft: 20 }}
                        size={20}
                        color={theme.text_color}
                    />
                    <AntDesign
                        onPress={() => props.onRepost(repost._id)}
                        name="retweet"
                        style={{ marginRight: 20 }}
                        size={20}
                        color={theme.text_color}
                    />
                    <Feather
                        name="send"
                        size={20}
                        color={theme.text_color}
                    />
                </View>
            </View>
        </View>
    )
}
export default RepostItem
const styles = StyleSheet.create({
    container:
    {
        padding: 10,
        flexDirection: "row",
        borderRadius: 15,
        alignSelf: 'center',
        margin: 10
    },
    rowContainer:
    {
        flexDirection: 'row',
    },
    profileContainer:
    {
        marginRight: 20,
        alignItems: "center"
    },
    imageProfile:
    {
        height: 40,
        width: 40,
        borderRadius: 40
    },
    rodeContainer:
    {
        position: 'absolute',
        top: 60,
        bottom: 20,
        width: 1,
        backgroundColor: 'silver',
    },
    rightContainer:
    {
        //  alignItems: 'center',
        width: "80%",
    },
    profileRowContainer:
    {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between'
    },
    txtFullname:
    {
        fontSize: 18,
        fontWeight: "bold",
    },
    rightRowProfileContainer:
    {
        flexDirection: 'row',
        alignItems: 'center',
    },
    txtCreatedAt:
    {
        color: "silver",
        marginRight: 20
    },
    postContainer:
    {
        padding: 5,
        borderWidth: 0.4,
        borderRadius: 10,
        //alignItems:'center'
    },
    profilePostContainer:
    {
        flexDirection: 'row',
        marginVertical: 5
    },
    imgPostProfile:
    {
        height: 30,
        width: 30,
        borderRadius: 30,
        marginRight: 15
    },
    profileTxtFullname:
    {
        fontSize: 18,
    },
    actionsRowContainer:
    {
        flexDirection: 'row',
        marginVertical: 5
    }
})
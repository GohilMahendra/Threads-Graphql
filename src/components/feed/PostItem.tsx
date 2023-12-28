import React from "react";
import { Text, Image, TouchableOpacity, StyleSheet } from "react-native"
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
import { twitter_blue } from "../../globals/Colors";
type PostItemsProps =
    {
        post: Thread,
        onPressComment: (postId: string) => void
        onRepost: (postId: string) => void,
        onPressNavigate: (userId: string) => void
        onLikeToggle: (postId: string, step: "like" | "unlike") => void
    }
const PostItem = (props: PostItemsProps) => {

    const post = props.post
    const media = post.media
    const { theme } = UseTheme()
    const likeAnim = useSharedValue<number>(1)

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

    const renderBioWithPressableHashtags = (bioText: string | undefined) => {
        if (!bioText) return null;
      
        const words = bioText.split(/\s+/);
      
        return (
          <View style={{ marginVertical: 5, flexDirection: 'row', flexWrap: 'wrap' }}>
            {words.map((word, index) => (
              <React.Fragment key={index}>
                {word.startsWith('#') ? (
                  <TouchableOpacity onPress={() => console.log('Pressed:', word)}>
                    <Text style={{ color: 'blue', fontWeight: 'bold' }}>{word}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text>{word}{' '}</Text>
                )}
              </React.Fragment>
            ))}
          </View>
        );
      };
      

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
                            style={styles.imgProfile}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.rodeContainer} />
            </View>

            <View style={styles.rightContainer}>
                <View style={styles.rightRowContainer}>
                    <View>
                        <Text style={[styles.txtUsername, { color: theme.text_color, }]}>{post.user.username}</Text>
                    </View>
                    <View style={styles.rightProfileContainer}>
                        <Text style={styles.txtCreatedAt}>{timeDifference(post.created_at)}</Text>
                        <Entypo
                            name="dots-three-horizontal"
                            size={18}
                            color={theme.text_color}
                        />
                    </View>
                </View>

                {renderBioWithPressableHashtags(post.content)}
                {/* <Text style={{
                    color: theme.text_color,
                    marginVertical: 5
                }}>{post.content}</Text> */}
                <GridViewer
                    media={media}
                />
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
                        onPress={() => props.onRepost(post._id)}
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
                {
                    (post.replies > 0 || post.likes > 0)
                    &&
                    <View style={styles.likeCommentsContainer}>
                        <Text style={[styles.txtComments, { color: theme.secondary_text_color, }]}>{post.replies} comments</Text>
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
    profileContainer:
    {
        marginRight: 20,
        alignItems: "center"
    },
    imgProfile:
    {
        height: 40,
        width: 40,
        borderRadius: 40
    },
    rodeContainer:
    {
        position: 'absolute',
        top: 60,
        bottom: 0,
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
    txtFullname:
    {
        fontSize: 15,
        fontWeight: "bold",
    },
    txtUsername:
    {
        fontSize: 18,
        fontWeight: "bold"
    },
    rightProfileContainer:
    {
        flexDirection: 'row',
        alignItems: 'center',
    },
    txtCreatedAt:
    {
        color: "silver",
        marginRight: 20
    },
    actionsRowContainer:
    {
        flexDirection: 'row',
        marginVertical: 5
    },
    likeCommentsContainer:
    {
        flexDirection: 'row',

    },
    txtComments:
    {
        fontSize: 13,
        marginRight: 25
    },
    textLikes:
    {
        fontSize: 13,
    }
})
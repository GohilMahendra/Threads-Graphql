import React, { useCallback, useMemo, useRef } from "react";
import { Text, Image, TouchableOpacity, Dimensions } from "react-native"
import { View } from "react-native"
import { placeholder_image } from "../../globals/asstes";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import { Media, Thread } from "../../types/Post";
import { getMediaImage, timeDifference } from "../../globals/utilities";
import { useDispatch } from "react-redux";
import { useAppDispatch } from "../../redux/store";
import { LikeAction, unLikeAction } from "../../redux/slices/FeedSlice";
import Animated, {
    useSharedValue,
    withSpring,
    useAnimatedStyle,
    Easing,
    withTiming,
    withSequence,
} from "react-native-reanimated";
import GridViewer from "./GridViewer";
import { useTheme } from "react-native-elements";
import UseTheme from "../../globals/UseTheme";
const { height, width } = Dimensions.get("screen")
type PostItemsProps =
    {
        post: Thread,
        onPressComment: (postId: string) => void
        onRepost: (postId: string) => void,
        onPressNavigate: (userId: string) => void
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


    const dispatch = useAppDispatch()

    const toggeleLike = () => {
        startAnimation()
        if (post.isLiked)
            dispatch(unLikeAction({ postId: post._id }))
        else
            dispatch(LikeAction({ postId: post._id }))
    }

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
                    <TouchableOpacity
                    onPress={()=>props.onPressNavigate(post.user._id)}
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
                    </TouchableOpacity>
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

                <View style={{
                    flexDirection: 'row',
                    marginVertical: 5
                }}>
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
                    <View style={{
                        flexDirection: 'row',

                    }}>
                        <Text style={{
                            fontSize: 13,
                            color: theme.secondary_text_color,
                            marginRight: 25
                        }}>{post.replies} comments</Text>
                        <Text style={{
                            fontSize: 13,
                            color: theme.secondary_text_color
                        }}>{post.likes} Likes</Text>
                    </View>
                }

            </View>
        </View>

    )

}
export default PostItem
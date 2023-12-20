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
import Animated, { useSharedValue,
    withSpring,
    useAnimatedStyle,
    Easing,
    withTiming,
    withSequence,} from "react-native-reanimated";
import GridViewer from "./GridViewer";
const { height, width } = Dimensions.get("screen")
type PostItemsProps =
    {
        post: Thread,
        onPressComment:(postId:string)=>void
        onRepost:()=>void
    }
const PostItem = (props: PostItemsProps) => {

    const post = props.post
    const media = post.media

    const likeAnim = useSharedValue<number>(1)

    const startAnimation = () =>
    {
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

    const toggeleLike = () =>
    {
        startAnimation()
        if(post.isLiked)
        dispatch(unLikeAction({postId: post._id}))
        else
        dispatch(LikeAction({postId: post._id}))
    }

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
                            height: 50,
                            width: 50,
                            borderRadius: 50
                        }}
                    />
                </View>
            </View>

            <View style={{
                //  alignItems: 'center',
                width: "80%",
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

                <View style={{
                    flexDirection: 'row',
                    marginVertical: 5
                }}>
                    <Animated.View 
                    style={[{
                    },animatedStyle]}>
                    <FontAwesome
                        onPress={() => toggeleLike()}
                        name={(post.isLiked) ? "heart" : "heart-o"}
                        size={20}
                        color={post.isLiked ? "red" : "black"}
                    />
                    </Animated.View>
                   
                    <FontAwesome
                        onPress={()=>props.onPressComment(post._id)}
                        name="comment-o"
                        style={{ marginRight: 20,marginLeft:20 }}
                        size={20}
                        color={"black"}
                    />
                    <AntDesign
                        onPress={()=>props.onRepost()}
                        name="retweet"
                        style={{ marginRight: 20 }}
                        size={20}
                        color={"black"}
                    />
                    <Feather
                        name="send"
                        size={20}
                        color={"black"}
                    />
                </View>

            </View>

            
        </View>

    )

}
export default PostItem
import React, { useState } from "react";
import { View, Image, Text } from "react-native";
import { CommentedPost } from "../../types/Comment";
import RepostItem from "../feed/RepostItem";
import PostItem from "../feed/PostItem";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { placeholder_image } from "../../globals/asstes";
import UseTheme from "../../globals/UseTheme";
import { timeDifference } from "../../globals/utilities";
import Entypo from "react-native-vector-icons/Entypo";
type RepliedPostProps =
    {
        commentPost: CommentedPost,
        toggleLike: (postId: string, step: "like" | "unlike") => void
        onReplyThreeDots:(replyId:string)=>void
        onPressComment:(postId:string)=>void
        onRepostIcon:(postId:string)=>void
    }
const RepliedPost = (props: RepliedPostProps) => {
    const { commentPost } = props
    const post = commentPost.post
    const user = useSelector((state: RootState) => state.User.user)
    const { theme } = UseTheme()
    const [replyModal,setReplyModal] = useState(false)
    return (<View>
        {
            (post.Repost && post.isRepost)
                ?
                <RepostItem
                    onLikeToggle={(postId, step) => props.toggleLike(postId, step)}
                    onPressComment={(postId) => props.onPressComment(postId)}
                    onPressNavigate={() => console.log("action")}
                    onRepost={(postId) =>props.onRepostIcon(postId)}
                    post={post}
                /> :
                <PostItem
                    onLikeToggle={(postId, step) => props.toggleLike(postId, step)}
                    onPressComment={(postId) => props.onPressComment(postId)}
                    onPressNavigate={() => console.log("action")}
                    onRepost={(postId) =>props.onRepostIcon(postId)}
                    post={post}
                />
        }
        <View style={{
             marginHorizontal: 20,
            padding: 10,
        }}>
        <View style={{
            flexDirection: 'row',
            justifyContent:'space-between',

        }}>
            <View style={{
                flexDirection: 'row',
            }}>
                <Image
                    style={{
                        height: 30,
                        width: 30,
                        borderRadius: 30
                    }}
                    source={(user.profile_picture) ? {
                        uri: user.profile_picture
                    } : placeholder_image}
                />
                <Text style={{
                    color: theme.text_color,
                    fontWeight: "bold",
                    marginLeft: 20,
                    fontSize: 15
                }}>{user.username}</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Text 
                
                style={{
                    color: theme.placeholder_color,
                    marginLeft: 20,
                    fontSize: 15,
                    marginRight:10
                }}>{timeDifference(commentPost.created_at)}</Text>
                <Entypo
                    onPress={()=>props.onReplyThreeDots(commentPost._id)}
                    name="dots-three-horizontal"
                    size={18}
                    color={theme.text_color}
                />
            </View>
        </View>
        <Text style={{
            fontSize:15,
            marginVertical:5,
            color: theme.text_color
        }}>{commentPost.content}</Text>
        </View>

        {/* <Modal
        visible={replyModal}
        animationType="slide"
        transparent
        onPointerCancel={()=>setReplyModal(false)}
        onRequestClose={()=>setReplyModal(false)}
        style={{
            flex:1,
            backgroundColor:'rgba(0,0,0,1)'
        }}
        >
            <View 
            style={{
                flex:1,
                backgroundColor:'rgba(0,0,0,0.3)',
                justifyContent:"flex-end",
                alignItems:"center"
            }}>
                <View style={{
                   
                    width:"100%",
                    backgroundColor:theme.background_color,
                    borderTopLeftRadius:20,
                    borderTopRightRadius:20,
                    padding:10,
        
                }} >
                    <View style={{
                        alignSelf:'center',
                        width:50,
                        height:3,
                
                        borderRadius:3,
                        backgroundColor: theme.placeholder_color
                    }}/>
                    <View style={{
                        justifyContent:'center',
                        alignItems:"center",
                        marginVertical:10
                    }}>
                    <TouchableOpacity
                    style={{
                        width:"100%",
                        borderRadius:15,
                      //  marginTop:20,
                        backgroundColor: theme.secondary_color,
                        padding:20
                    }}
                    >
                        <Text style={{
                            color: "red",
                            fontWeight:"bold",
                            fontSize:15
                        }}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>setReplyModal(false)}
                    style={{
                        width:"100%",
                        borderRadius:15,
                        marginVertical:10,
                        backgroundColor: theme.secondary_color,
                        padding:20
                    }}
                    >
                        <Text style={{
                            color: theme.text_color,
                            fontWeight:"bold",
                            fontSize:15,
                            
                        }}>Cancel</Text>
                    </TouchableOpacity>
                    </View>
                   
                </View>
            </View>
        </Modal> */}
        
    </View>
    )
}
export default RepliedPost
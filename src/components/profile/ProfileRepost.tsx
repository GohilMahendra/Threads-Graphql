import React from "react";
import { Text, Image, TouchableOpacity, Dimensions, StyleSheet } from "react-native"
import { View } from "react-native"
import { placeholder_image } from "../../globals/asstes";
import Entypo from "react-native-vector-icons/Entypo";
import {  Thread } from "../../types/Post";
import { timeDifference } from "../../globals/utilities";
import GridViewer from "../feed/GridViewer";
import UseTheme from "../../globals/UseTheme";
type PostItemsProps =
    {
        post: Thread,
        onPressThreeDots:(postId:string)=>void
    }
const ProfileRepost = (props: PostItemsProps) => {
    const post = props.post
    const media = post.media
    const repost = post.Repost as Thread
    const {theme} = UseTheme()
    return (
        <View style={[styles.container,{ backgroundColor: theme.background_color,}]}>
            <View style={styles.rowContainer}>
                <View style={styles.imageContainer}>
                   <TouchableOpacity>
                   <Image
                        resizeMode="cover"
                        source={post.user.profile_picture ? {
                            uri: post.user.profile_picture
                        } : placeholder_image}
                        style={styles.imgProfile}
                    />
                   </TouchableOpacity>
                   <View style={styles.threadRode}/>
                </View>
            </View>
            <View style={styles.rightContainer}>
                <View style={styles.profileRowContainer}>
                    <Text style={[styles.txtFullname,{color: theme.text_color,}]}>{post.user.username}</Text>
                    <View style={styles.rightRowContainer}>
                        <Text style={styles.txtCreatedAt}>{timeDifference(post.created_at)}</Text>
                        <Entypo
                            onPress={()=>props.onPressThreeDots(post._id)}
                            name="dots-three-horizontal"
                            size={18}
                            color={theme.text_color}
                        />
                    </View>
                </View>
                <Text style={{color: theme.text_color,marginVertical:5}}>{post.content}</Text>
                {/* origional post container starts */}
                <View style={[styles.postContainer,{ borderColor: theme.text_color,}]}>
                    <TouchableOpacity 
                    style={styles.postImageContainer}>
                        <Image
                        style={styles.imgProfilePost}
                        source={post.Repost?.user.profile_picture?
                        {uri:post.Repost?.user.profile_picture}:
                        placeholder_image
                        }
                        />
                        <View>
                            <Text style={[styles.textPostFullname,{ color: theme.text_color}]}>{post.Repost?.user.username}</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={{
                        color: theme.text_color
                    }}>{post.Repost?.content}</Text>
                    <GridViewer
                    media={post.Repost?.media || []}
                    />
                </View>
            </View>
        </View>
    )
}
export default ProfileRepost
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
    imageContainer:
    {
        marginRight: 20,
        alignItems:"center"
    },
    imgProfile:
    {
        height: 50,
        width: 50,
        borderRadius: 50
    },
    threadRode:
    {
        position: 'absolute',
        top: 60,
        bottom: 20,
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
        alignItems:"center",
        justifyContent: 'space-between'
    },
    txtFullname:
    {
        fontSize: 18,
        fontWeight: "bold",
    },
    rightRowContainer:
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
        padding:5,
        borderWidth:0.4,
        borderRadius:10,
        //alignItems:'center'
    },
    postImageContainer:
    {
        flexDirection:'row',
        marginVertical:5
    },
    imgProfilePost:
    {
        height:30,
        width:30,
        borderRadius:30,
        marginRight:15
    },
    textPostFullname:
    {
        fontSize:18,
    }
})
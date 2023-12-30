import React from "react";
import { Text, Image, TouchableOpacity, Dimensions, StyleSheet } from "react-native"
import { View } from "react-native"
import { placeholder_image } from "../../globals/asstes";
import Entypo from "react-native-vector-icons/Entypo";
import {  Thread } from "../../types/Post";
import { scaledFont, timeDifference } from "../../globals/utilities";
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
    const renderBioWithPressableHashtags = (bioText: string | undefined) => {
        if (!bioText) return null;
      
        const words = bioText.split(/\s+/);
      
        return (
          <View style={{ marginVertical: 5, flexDirection: 'row', flexWrap: 'wrap' }}>
            {words.map((word, index) => (
              <React.Fragment key={index}>
                {word.startsWith('#') ? (
                  <TouchableOpacity onPress={() => console.log('Pressed:', word)}>
                    <Text style={{ color: 'blue',fontSize:scaledFont(13), fontWeight: 'bold' }}>{word}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={{color: theme.text_color,fontSize:scaledFont(13)}}>{word}{' '}</Text>
                )}
              </React.Fragment>
            ))}
          </View>
        );
      };
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
                            size={scaledFont(18)}
                            color={theme.text_color}
                        />
                    </View>
                </View>
                {renderBioWithPressableHashtags(post.content)}
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
                    {renderBioWithPressableHashtags(post.Repost?.content)}
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
        height: scaledFont(50),
        width:  scaledFont(50),
        borderRadius: scaledFont(50)
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
        fontSize: scaledFont(18),
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
        marginRight: 10,
        fontSize:scaledFont(13)
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
        height:scaledFont(30),
        width:scaledFont(30),
        borderRadius:scaledFont(30),
        marginRight:15
    },
    textPostFullname:
    {
        fontSize:scaledFont(18),
    }
})

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Dimensions, View, TextInput, Image, FlatList, TouchableOpacity } from "react-native";
import { BASE_URL } from "../../globals/constants";
import { getToken, timeDifference } from "../../globals/utilities";
import { Comment } from "../../types/Comment";
import { placeholder_image } from "../../globals/asstes";
import { Text } from "react-native";
import { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome";
import { getCommentsAction, getMoreCommentsAction } from "../../redux/slices/ReplySlice";
const { height, width } = Dimensions.get("screen")

type ReplyPropTypes =
    {
        postId: string
    }
const Replies = (props: ReplyPropTypes) => {

    const { postId } = props

    const comments = useSelector((state:RootState)=>state.Reply.comments)
    const loading = useSelector((state:RootState)=>state.Reply.loading)
    const error = useSelector((state:RootState)=>state.Reply.error)
    const lastOffset = useSelector((state:RootState)=>state.Reply.lastOffset)
    const loadMoreLoading = useSelector((state:RootState)=>state.Reply.loadMoreLoading)
    const loadMoreError = useSelector((state:RootState)=>state.Reply.loadMoreError)
    const [comment,setComment] = useState<string>("")
    const User = useSelector((state:RootState)=>state.User.user)
    const dispath = useAppDispatch()
    const commentRenderItem = (comment: Comment,index:number)=>
    {
        return(
            <View 
            key={comment._id}
            style={{
                flexDirection:"row",
                padding:10,
                elevation:10,
                alignItems:"center",
                borderBottomWidth:1,
                borderColor:"silver"
            }}>
                <Image
                source={comment.user.profile_picture?
                {uri:comment.user.profile_picture}:
                placeholder_image
                }
                style={{
                    height:30,
                    width:30,
                    borderRadius:30,
                    marginRight:20
                }}
                />
                <View style={{
                     width:"80%",
                }}>
                    <View style={{
                        flexDirection:'row',
                        width:"100%",
                        alignItems:'center',
                        justifyContent:'space-between'
                    }}>
                        <Text style={{
                            fontSize:15,
                            fontWeight:"500"
                        }}>{comment.user.fullname}</Text>
                        <View style={{
                            flexDirection:'row'
                        }}>
                            <Text style={{
                                color:"silver"
                            }}>{timeDifference(comment.created_at)}</Text>
                        </View>
                    </View>
                    <Text>{comment.content}</Text>
                </View>

            </View>
        )
    }

    const getComments = async() =>
    {
        await  dispath(getCommentsAction({
            postId
        }))
    }
    useEffect(()=>{
      getComments()
    },[postId])

    return (
        <View style={{
            flex: 1,
            position:'absolute',
            elevation:20,
            width:width,
            height:height,
        }}>
            {/* list containing replies */}
            <View style={{
                flex:1
            }}>
                <View style={{
                    padding:10,
                    justifyContent:"center",
                    alignItems:"center",
                    width: "100%",
                    borderBottomWidth:1,
                    borderBottomColor:"silver"
                }}>
                    <Text style={{
                        fontSize:18,
                        color:"black",
                        fontWeight:'bold'
                    }}>Comments</Text>
                </View>
                <FlatList
                style={{
                    flex:1,
                }}
                data={comments}
                renderItem={({item,index})=>commentRenderItem(item,index)}
                keyExtractor={(item,index)=> index.toString()}
                onEndReached={()=> dispath(getMoreCommentsAction({postId}))}
                />
            </View>
         

            {/* text input to add reply */}
            <View style={{
                flexDirection:'row',
                alignItems:"center",
                position:"absolute",
                alignSelf:"center",
                padding:10,
                zIndex:1000,
                top: height/1.7
               
            }}>
            <Image
            source={User.profile_picture?{uri:User.profile_picture}:placeholder_image}
            style={{
                height:40,
                width:40,
                borderRadius:40,
                marginRight:20
            }}
            />
            <View style={{
                width:"80%",
                padding:15,
                backgroundColor:"#E5E5E5",
                alignSelf:'center',
                borderRadius:10,
                flexDirection:"row",
                marginVertical:20
            }}>
                <TextInput
                maxLength={200}
                multiline
                autoCapitalize={"none"}
                value={comment}
                onChangeText={text=>setComment(text)}
                placeholderTextColor={"grey"}
                placeholder={"Reply ..."}
                style={{
                    flex:1,
                    padding:5,
                }}
                />
                <TouchableOpacity
                style={{
                   
                   // padding:10
                }}
                >
                    <FontAwesome5Icon
                    name="send"
                    color={"black"}
                    
                    size={30}
                    />
                </TouchableOpacity>
            </View>
            </View>
          
        </View>
    )
}
export default Replies
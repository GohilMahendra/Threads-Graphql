
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, View, TextInput, Image, FlatList, TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform } from "react-native";
import { timeDifference } from "../../globals/utilities";
import { Comment } from "../../types/Comment";
import { placeholder_image } from "../../globals/asstes";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { commentPostAction, getCommentsAction, getMoreCommentsAction } from "../../redux/slices/ReplySlice";
import { StyleSheet } from "react-native";
import UseTheme from "../../globals/UseTheme";
import Loader from "../global/Loader";
const { height, width } = Dimensions.get("screen")

type ReplyPropTypes =
    {
        postId: string
    }
const Replies = (props: ReplyPropTypes) => {

    const { postId } = props
    const comments = useSelector((state: RootState) => state.Reply.comments)
    const inputRef = useRef<TextInput|null>(null)
    const loading = useSelector((state: RootState) => state.Reply.loading)
    const screeenLoading = useSelector((state: RootState) => state.Reply.screeenLoading)
    const error = useSelector((state: RootState) => state.Reply.error)
    const loadMoreLoading = useSelector((state: RootState) => state.Reply.loadMoreLoading)
    const loadMoreError = useSelector((state: RootState) => state.Reply.loadMoreError)
    const [comment, setComment] = useState<string>("")
    const { theme } = UseTheme()
    const User = useSelector((state: RootState) => state.User.user)
    const dispath = useAppDispatch()
    const commentRenderItem = (comment: Comment, index: number) => {
        return (
            <View
                key={comment._id}
                style={{
                    flexDirection: "row",
                    padding: 10,
                    elevation: 10,
                    //  alignItems: "center",
                    borderBottomWidth: 1,
                    borderColor: theme.secondary_text_color
                }}>
                <Image
                    source={comment.user.profile_picture ?
                        { uri: comment.user.profile_picture } :
                        placeholder_image
                    }
                    style={{
                        height: 30,
                        width: 30,
                        alignItems: "flex-start",
                        borderRadius: 30,
                        marginRight: 20
                    }}
                />
                <View style={{
                    width: "80%",
                }}>
                    <View style={{
                        flexDirection: 'row',
                        width: "100%",
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{
                            fontSize: 15,
                            fontWeight: "500",
                            color: theme.text_color
                        }}>{comment.user.fullname}</Text>
                        <View style={{
                            flexDirection: 'row'
                        }}>
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

    const onComment = async() =>
    {
        if(!comment)
        return null

        dispath(commentPostAction({
            content: comment,
            postId: postId
        }))
        setComment("")
    }

    const getComments = async () => {
        await dispath(getCommentsAction({
            postId
        }))
    }
    useEffect(() => {
        inputRef.current?.focus()
        getComments()
    }, [])

    return (
        <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: theme.secondary_background_color }]}>
            {/* list containing replies */}
            {screeenLoading && <Loader/>}
            <View style={styles.header}>
                <Text style={[styles.headerText, { color: theme.text_color }]}>Comments</Text>
            </View>
            <FlatList
                refreshControl={
                    <RefreshControl
                        tintColor={theme.text_color}
                        refreshing={loading}
                        onRefresh={() => getComments()}
                    />
                }
                ListEmptyComponent={() => !loading && comments.length == 0 ?
                    <View style={styles.emptyContainer}>
                        <Text style={{
                            color: theme.text_color
                        }}>No comments to show !</Text>
                    </View> : null
                }
                contentContainerStyle={{
                    flex: 1
                }}
                style={{
                    flex: 1,
                }}
                data={comments}
                renderItem={({ item, index }) => commentRenderItem(item, index)}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={() => dispath(getMoreCommentsAction({ postId }))}
            />
            <View style={[styles.commentContainer, { backgroundColor: theme.background_color }]}>
                <Image
                    source={User.profile_picture ? { uri: User.profile_picture } : placeholder_image}
                    style={styles.imageUser}
                />
                <View style={[styles.commentRowContainer, { backgroundColor: theme.background_color }]}>
                    <TextInput
                        ref = {ref=>inputRef.current = ref}
                        multiline
                        value={comment}
                        onChangeText={(text) => setComment(text)}
                        placeholder={"add a comment ...."}
                        placeholderTextColor={"silver"}
                        style={[styles.inputComment, { color: theme.text_color }]}
                    />
                    <TouchableOpacity
                        onPress={() => onComment()}
                        style={[styles.btnAddComment, { backgroundColor: theme.primary_color }]}
                    >
                        <MaterialIcons
                            size={20}
                            color={"white"}
                            name="ios-share"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}
export default Replies
const styles = StyleSheet.create({
    container:
    {
        //   flex: 1,
        elevation: 20,
        backgroundColor: "green",
        height: height * 0.9
    },
    header:
    {
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "silver"
    },
    headerText:
    {
        fontSize: 18,
        color: "black",
        fontWeight: 'bold'
    },
    emptyContainer:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    commentContainer:
    {
        position: 'absolute',
        bottom: 100,
      // top:"70%",

       paddingVertical:10,
        borderRadius: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    imageUser:
    {
        height: 30,
        width: 30,
        borderRadius: 30,
        marginRight: 20
    },
    commentRowContainer:
    {
        borderRadius: 10,
        maxHeight:200,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

    },
    inputComment:
    {
        padding: 5,
        width: "70%",
        maxHeight: 200,

    },
    btnAddComment:
    {
        height: 40,
        width: 40,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: "black"
    }

})
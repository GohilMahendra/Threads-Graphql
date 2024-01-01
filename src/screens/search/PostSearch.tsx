import { View, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Thread } from '../../types/Post'
import PostItem from '../../components/feed/PostItem'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../redux/store'
import {
    createRepostSearchAction,
    fetchMorePostSearchAction,
    fetchPostSearchAction,
    likePostSearchAction,
    unlikePostSearchAction
} from '../../redux/actions/PostSearchActions'
import Replies from '../../components/feed/Replies'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Text } from 'react-native-elements'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import RepostItem from '../../components/feed/RepostItem'
import { RefreshControl } from 'react-native'
import UseTheme from '../../globals/UseTheme'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { compositePostSearchRootNavigation } from '../../navigations/Types'
import { scaledFont } from '../../globals/utilities'
import { SearchStackParams } from '../../navigations/SearchStack'
import Loader from '../../components/global/Loader'
const PostSearch = () => {
    const navigation = useNavigation<compositePostSearchRootNavigation>()
    const route = useRoute<RouteProp<SearchStackParams, "PostSearch">>()
    const searchTerm = route.params.searchTerm
    const { theme } = UseTheme()
    const posts = useSelector((state: RootState) => state.PostSearch.Threads)
    const loading = useSelector((state: RootState) => state.PostSearch.loading)
    const screenLoading = useSelector((state: RootState) => state.PostSearch.screenLoading)
    const lastOffset = useSelector((state: RootState) => state.PostSearch.lastOffset)
    const loadMoreloading = useSelector((state: RootState) => state.PostSearch.loadMoreLoading)
    const dispatch = useAppDispatch()
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const repostSheetModalRef = useRef<BottomSheetModal>(null)
    const snapPoints = useMemo(() => ['90%', '20%'], []);
    const [postId, setPostId] = useState("")
    const snapPointsRepost = useMemo(() => ["30%"], [])
    const handleRepostModal = useCallback((postId: string) => {
        setPostId(postId)
        repostSheetModalRef.current?.present()
    }, [])
    const handlePresentModalPress = useCallback((postId: string) => {
        setPostId(postId)
        bottomSheetModalRef.current?.present();
    }, []);

    const onPressRepost = async () => {
        repostSheetModalRef.current?.close()
        await dispatch(createRepostSearchAction({ postId }))
    }

    const onPressQouteRepost = async () => {
        repostSheetModalRef.current?.close()
        const Post = posts.find(post => post._id == postId)
        let Thread = Post
        if (Post?.Repost && Post.isRepost) {
            Thread = Post.Repost
        }
        if (Thread)
            navigation.navigate("QoutePost", {
                Thread: Thread
            })

    }

    const navigateToProfile = (userId: string) => {
        navigation.navigate("UserProfile", {
            userId: userId
        })
    }
    const onLikeToggle = (postId: string, state: "like" | "unlike") => {
        if (state == "like") {
            dispatch(likePostSearchAction({ postId: postId }))
        }
        else {
            dispatch(unlikePostSearchAction({ postId: postId }))
        }
    }
    const renderPosts = (item: Thread, index: number) => {
        return (
            item.isRepost && item.Repost ?
                <RepostItem
                    onLikeToggle={(postId, state) => onLikeToggle(postId, state)}
                    onPressNavigate={(userId) => navigateToProfile(userId)}
                    onPressComment={handlePresentModalPress}
                    onRepost={handleRepostModal}
                    key={item._id}
                    post={item}
                />
                :
                <PostItem
                    onLikeToggle={(postId, state) => onLikeToggle(postId, state)}
                    onPressNavigate={(userId) => navigateToProfile(userId)}
                    onPressComment={handlePresentModalPress}
                    onRepost={handleRepostModal}
                    key={item._id}
                    post={item}
                />
        )
    }
    const fetchMorePosts = async () => {
        await dispatch(fetchMorePostSearchAction({ searchTerm: searchTerm }))
    }
    useEffect(() => {
        dispatch(fetchPostSearchAction({ searchTerm: searchTerm }))
    }, [])
    return (
        <SafeAreaView style={styles.container}>
            <GestureHandlerRootView style={styles.gestureContainer}>
                {screenLoading && <Loader/>}
                <View style={[styles.contentContainer, { backgroundColor: theme.background_color }]}>
                    <View style={styles.headerContainer}>
                        <FontAwesome
                            onPress={() => navigation.goBack()}
                            name='angle-left'
                            size={scaledFont(25)}
                            color={theme.text_color}
                        />
                        <Text style={[styles.textHeader, {
                            color: theme.text_color,
                        }]}>{searchTerm}</Text>
                        <View />
                    </View>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                tintColor={theme.text_color}
                                refreshing={loading}
                                onRefresh={() => dispatch(fetchPostSearchAction({ searchTerm: searchTerm }))}
                            />
                        }
                        ListFooterComponent={() => loadMoreloading &&
                            <ActivityIndicator
                                animating
                                color={theme.text_color}
                                size={"small"}
                            />
                        }
                        data={posts}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReached={() => lastOffset && fetchMorePosts()}
                        renderItem={({ item, index }) => renderPosts(item, index)}
                        style={{
                            flex: 1
                        }}
                    />
                    <BottomSheetModalProvider>
                        <BottomSheetModal
                            style={styles.sheetComment}
                            handleStyle={[styles.sheetHandle, {
                                backgroundColor: theme.secondary_background_color,
                                borderColor: theme.text_color
                            }]}
                            handleIndicatorStyle={{ borderColor: theme.text_color, borderWidth: 2 }}
                            ref={bottomSheetModalRef}
                            snapPoints={snapPoints}
                            backdropComponent={(props) => (
                                <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
                            )}
                        >
                            <Replies postId={postId} />
                        </BottomSheetModal>
                        <BottomSheetModal
                            style={styles.sheetRepost}
                            index={0}
                            backdropComponent={(props) => (
                                <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
                            )}
                            handleStyle={[styles.handleRepost, {
                                backgroundColor: theme.secondary_background_color,
                                borderColor: theme.text_color
                            }]}
                            handleIndicatorStyle={{ borderColor: theme.text_color, borderWidth: 2 }}
                            ref={repostSheetModalRef}
                            snapPoints={snapPointsRepost}
                        >
                            <View style={[styles.sheetOptionContainer, { backgroundColor: theme.secondary_background_color }]}>
                                <TouchableOpacity
                                    onPress={() => onPressRepost()}
                                    style={[styles.btnRepost, { backgroundColor: theme.secondary_background_color, }]}>
                                    <FontAwesome
                                        name="retweet"
                                        style={{ marginRight: 10 }}
                                        size={scaledFont(20)}
                                        color={theme.text_color}
                                    />
                                    <Text style={{ color: theme.text_color, fontSize: scaledFont(15) }}>Repost</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => onPressQouteRepost()}
                                    style={[styles.btnQouteRepost, { backgroundColor: theme.secondary_background_color, }]}>
                                    <FontAwesome
                                        name="quote-left"
                                        style={{ marginRight: 10 }}
                                        size={scaledFont(20)}
                                        color={theme.text_color}
                                    />
                                    <Text style={{ color: theme.text_color, fontSize: scaledFont(15) }}>Repost with Qoute</Text>
                                </TouchableOpacity>
                            </View>
                        </BottomSheetModal>
                    </BottomSheetModalProvider>
                </View>
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}
export default PostSearch
const styles = StyleSheet.create({
    gestureContainer:
    {
        flex: 1,
    },
    container:
    {
        flex: 1
    },
    contentContainer:
    {
        flex: 1
    },
    selectionContainer:
    {
        // padding:20,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center'
    },
    btnForYou:
    {
        padding: 10,
        paddingVertical: 15,
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
    },
    textForyou:
    {
        fontSize: scaledFont(15),
        fontWeight: "bold"
    },
    btnFollowing:
    {
        padding: 10,
        paddingVertical: 15,
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
    },
    textFollowing:
    {
        fontSize: scaledFont(15),
        fontWeight: "bold"
    },
    sheetComment:
    {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    sheetHandle:
    {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    sheetRepost:
    {
        flex: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    handleRepost:
    {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    sheetOptionContainer:
    {
        flex: 1,
        padding: 20,
    },
    btnRepost:
    {
        padding: 20,
        flexDirection: "row",
        width: "100%",
        alignItems: 'center',
        borderRadius: 15,
        marginVertical: 5
    },
    btnQouteRepost:
    {
        padding: 20,
        flexDirection: "row",
        borderRadius: 15,
        alignItems: "center",
        width: "100%"
    },
    headerContainer:
    {
        flexDirection: "row",
        padding: 20,
        paddingVertical: 10,
        justifyContent: "space-between",
        alignItems: "center"
    },
    textHeader:
    {
        fontSize: scaledFont(18),
        fontWeight: "bold"
    }
})
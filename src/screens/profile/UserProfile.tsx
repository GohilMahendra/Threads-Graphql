import { View, Text, SafeAreaView, Image, TouchableOpacity, Dimensions, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { placeholder_image } from '../../globals/asstes'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { RouteProp, useNavigation, StackActions, useRoute } from '@react-navigation/native'
import { FlatList } from 'react-native'
import { Thread } from '../../types/Post'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import UseTheme from '../../globals/UseTheme'
import { User } from '../../types/User'
import { SearchStackParams } from '../../navigations/SearchStack'
import { fetchUserById, followUser, unFollowUser } from '../../apis/UserAPI'
import { createRepost, fetchPostsByUser, likePost, unLikePost } from '../../apis/FeedAPI'
import RepostItem from '../../components/feed/RepostItem'
import PostItem from '../../components/feed/PostItem'
import { PAGE_SIZE } from '../../globals/constants'
import Replies from '../../components/feed/Replies'
import Loader from '../../components/global/Loader'
import { scaledFont } from '../../globals/utilities'
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated'
import { compositeUserProfileRootNavigation } from '../../navigations/Types'
const { height, width } = Dimensions.get("screen")
const UserProfile = () => {
    const [user, setUser] = useState<User>({
        _id: "",
        email: "",
        followers: 0,
        following: 0,
        fullname: "",
        username: "",
        verified: false,
        bio: "",
        profile_picture: "",
        isFollowed: false
    })
    const [loading, setLoading] = useState(false)
    const [moreLoading, setMoreLoading] = useState(false)
    const [screenLoading, setScreenLoading] = useState(false)
    const route = useRoute<RouteProp<SearchStackParams, "UserProfile">>()
    const userId = route.params.userId
    const [posts, setPosts] = useState<Thread[]>([])
    const detailViewHeight = useRef<number>(0)
    const [lastOffset, setLastOffset] = useState<string | null>(null)
    const navigation = useNavigation<compositeUserProfileRootNavigation>()
    const [selectedSection, setSelectedSection] = useState<"Thread" | "Repost">("Thread")
    const [postId, setPostId] = useState("")
    const { theme } = UseTheme()
    const replySnapPoints = useMemo(() => ['90%', "50%"], []);
    const snapPointsRepost = useMemo(() => ["30%"], []);
    const replyBottomSheetRef = useRef<BottomSheetModal>(null)
    const repostBottomSheetRef = useRef<BottomSheetModal>(null)
    const translateY = useSharedValue(scaledFont(-100));

    const scrollHandler = (yHeight: number) => {
        const yMoveIndex = yHeight > height ? 0 : scaledFont(-100);
        if (translateY.value !== yMoveIndex) {
            translateY.value = withTiming(yMoveIndex, { duration: 500 });
        }
    }
    const navigateToProfile = (userId: string) => {
        if (userId != route.params.userId) {
            const push = StackActions.push("UserProfile", { userId: userId })
            navigation.dispatch(push)
        }
    }
    const replyIconPress = (postId: string) => {
        setPostId(postId)
        replyBottomSheetRef.current?.present()
    }
    const repostIconPress = (postId: string) => {
        setPostId(postId)
        repostBottomSheetRef.current?.present()
    }
    const onPressRepost = async () => {
        try {
            repostBottomSheetRef.current?.close()
            setScreenLoading(true)
            const repostResponse = await createRepost(postId)
            setScreenLoading(false)
        }
        catch (err) {
            setScreenLoading(false)
            console.log(err)
        }
    }
    const onPressQouteRepost = async () => {
        const thread = posts.find(post => post._id === postId)
        if (thread)
            navigation.navigate("QoutePost", {
                Thread: thread
            })
    }
    const renderPosts = (item: Thread, index: number) => {
        return (
            item.isRepost && item.Repost ?
                <RepostItem
                    onLikeToggle={(postid, step) => toggleLike(postid, step)}
                    onPressNavigate={(userId) => navigateToProfile(userId)}
                    onPressComment={(postId) => replyIconPress(postId)}
                    onRepost={(postId) => repostIconPress(postId)}
                    key={item._id}
                    post={item}
                />
                :
                <PostItem
                    onLikeToggle={(postid, step) => toggleLike(postid, step)}
                    onPressNavigate={(userId) => navigateToProfile(userId)}
                    onPressComment={(postId) => replyIconPress(postId)}
                    onRepost={(postId) => repostIconPress(postId)}
                    key={item._id}
                    post={item}
                />
        )
    }
    const onChangeField = (field: "Thread" | "Repost") => {
        setSelectedSection(field)
        getPosts(field)
    }
    const getPosts = async (field: "Thread" | "Repost") => {
        try {
            setLoading(true)
            setPosts([])
            const response = await fetchPostsByUser({
                pageSize: PAGE_SIZE,
                post_type: field,
                userId: userId,
            })
            setPosts(response.data)
            setLastOffset(response.meta.lastOffset)
            setLoading(false)
        }
        catch (err) {
            setLoading(false)
            console.log(JSON.stringify(err))
        }
    }
    const getMorePosts = async () => {
        try {
            if (!lastOffset) {
                console.log("last offset", lastOffset)
                return null
            }
            setMoreLoading(true)
            const response = await fetchPostsByUser({
                pageSize: PAGE_SIZE,
                post_type: selectedSection,
                userId: userId,
                lastOffset: lastOffset
            })
            setPosts([...posts, ...response.data])
            setLastOffset(response.meta.lastOffset)
            setMoreLoading(false)
        }
        catch (err) {
            setMoreLoading(false)
            console.log(JSON.stringify(err))
        }
    }
    const getUser = async () => {
        try {
            const response = await fetchUserById(userId)
            setUser(response.user)
        }
        catch (err) {
            console.log(err)
        }
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
                                <Text style={{ color: 'blue', fontSize: scaledFont(13), fontWeight: 'bold' }}>{word} </Text>
                            </TouchableOpacity>
                        ) : (
                            <Text style={{ color: theme.text_color, fontSize: scaledFont(13) }}>{word}{' '}</Text>
                        )}
                    </React.Fragment>
                ))}
            </View>
        );
    };
    const toggleFollow = async () => {
        try {
            if (user.isFollowed) {
                const response = await unFollowUser(userId)
                setUser(prevUser => ({ ...prevUser, isFollowed: false, followers: prevUser.followers - 1 }));
            }
            else {
                const response = await followUser(userId)
                setUser(prevUser => ({ ...prevUser, isFollowed: true, followers: prevUser.followers + 1 }));
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    const toggleLike = async (postId: string, step: "like" | "unlike") => {
        try {
            if (step == "like") {
                const respose = await likePost(postId)
                const index = posts.findIndex(post => post._id == postId)
                if (index != -1) {
                    const postThreads = [...posts]
                    postThreads[index].isLiked = true
                    postThreads[index].likes++
                    setPosts(postThreads)
                }
            }
            else {
                const response = await unLikePost(postId)
                const index = posts.findIndex(post => post._id == postId)
                if (index != -1) {
                    const postThreads = [...posts]
                    postThreads[index].isLiked = false
                    postThreads[index].likes--
                    setPosts(postThreads)
                }
            }
        }
        catch (err) {

        }
    }
    const getUserAndPosts = async () => {
        await getUser()
        await getPosts("Thread")
    }
    const renderHeaderComponent = () => {
        return (
            <View>
                <View style={styles.headerContainer}>
                    <FontAwesome
                        onPress={() => navigation.goBack()}
                        name='angle-left'
                        size={scaledFont(25)}
                        color={theme.text_color}
                    />
                    <View style={{ flexDirection: "row" }}>
                        <AntDesign
                            name='instagram'
                            size={scaledFont(25)}
                            color={theme.text_color}
                            style={{ marginRight: 10 }}
                        />
                        <AntDesign
                            name='bars'
                            size={scaledFont(25)}
                            color={theme.text_color}
                        />
                    </View>
                </View>
                <View
                    onLayout={event => {
                        detailViewHeight.current = event.nativeEvent.layout.height
                    }}
                    style={styles.userDetailsContainer}>
                    <View style={styles.userDetailRowContainer}>
                        <View>
                            <Text style={[styles.txtUserFullname, {
                                color: theme.text_color
                            }]}>{user.fullname}</Text>
                            <Text style={{
                                color: theme.text_color
                            }}>{user.username}</Text>
                        </View>
                        <Image
                            source={user.profile_picture ? { uri: user.profile_picture } : placeholder_image}
                            style={styles.imgUserDetail}
                        />
                    </View>
                    {renderBioWithPressableHashtags(user.bio || "")}
                    <Text style={{ color: theme.text_color }}>{user.followers} Followers</Text>
                    <TouchableOpacity
                        onPress={() => toggleFollow()}
                        style={[styles.btnFollow, {
                            backgroundColor: user.isFollowed ? theme.background_color : theme.text_color,
                            borderWidth: user.isFollowed ? 1 : 0,
                            borderColor: user.isFollowed ? theme.text_color : theme.background_color,
                        }]}>
                        <Text style={[styles.txtFollow, {
                            color: user.isFollowed ? theme.text_color : theme.background_color
                        }]}>{user.isFollowed ? "Following" : "Follow"}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: theme.background_color }}>
                    <View style={styles.optionContainer}>
                        <TouchableOpacity
                            onPress={() => onChangeField("Thread")}
                            style={[styles.btnThreads, {
                                borderBottomWidth: (selectedSection == "Thread") ? 1 : 0,
                                borderColor: theme.text_color
                            }]}
                        >
                            <Text style={{
                                fontSize: scaledFont(15),
                                color: theme.text_color
                            }}>Threads</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onChangeField("Repost")}
                            style={[styles.btnReposts, {
                                borderBottomWidth: (selectedSection == "Repost") ? 1 : 0,
                                borderColor: theme.text_color
                            }]}
                        >
                            <Text style={{
                                fontSize: scaledFont(15),
                                color: theme.text_color
                            }}>Reposts</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        )
    }
    const renderEmptyComponent = () => {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.txtEmpty,
                {color: theme.secondary_text_color}]}>No posts created by {user.username}</Text>
            </View>
        )
    }
    useEffect(() => {
        getUserAndPosts()
    }, [])

    return (
        <GestureHandlerRootView style={styles.gestureContainer}>
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: theme.background_color
                }}>
                {screenLoading && <Loader />}
                <Animated.View style={{
                    backgroundColor: theme.background_color,
                    transform: [{ translateY: translateY }],
                    position: "absolute",
                    paddingTop: 20,
                    zIndex: 1000
                }}>
                    <View style={styles.optionContainer}>
                        <TouchableOpacity
                            onPress={() => onChangeField("Thread")}
                            style={[styles.btnThreads, {
                                borderBottomWidth: (selectedSection == "Thread") ? 1 : 0,
                                borderColor: theme.text_color
                            }]}
                        >
                            <Text style={{
                                fontSize: scaledFont(15),
                                color: theme.text_color
                            }}>Threads</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onChangeField("Repost")}
                            style={[styles.btnReposts, {
                                borderBottomWidth: (selectedSection == "Repost") ? 1 : 0,
                                borderColor: theme.text_color
                            }]}
                        >
                            <Text style={{
                                fontSize: scaledFont(15),
                                color: theme.text_color
                            }}>Reposts</Text>
                        </TouchableOpacity>

                    </View>
                </Animated.View>
                <FlatList
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={() => getPosts(selectedSection)}
                        />
                    }
                    ListHeaderComponent={() => renderHeaderComponent()}
                    ListEmptyComponent={() => !loading && renderEmptyComponent()}
                    data={posts}
                    keyExtractor={item => item._id}
                    ListFooterComponent={() =>
                        moreLoading && <ActivityIndicator
                            color={theme.text_color}
                            size={"small"}
                            animating
                        />
                    }
                    scrollEventThrottle={10}
                    onScroll={(event) => scrollHandler(event.nativeEvent.contentOffset.y)}
                    renderItem={({ item, index }) => renderPosts(item, index)}
                    onEndReached={() => lastOffset && getMorePosts()
                    }
                />
            </SafeAreaView>
            <BottomSheetModalProvider>
                <BottomSheetModal
                    ref={replyBottomSheetRef}
                    snapPoints={replySnapPoints}
                    index={0}
                    backdropComponent={(props) => (
                        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
                    )}
                    handleIndicatorStyle={{ borderColor: theme.text_color, borderWidth: 2 }}
                >
                    <Replies
                        postId={postId}
                    />
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
                    ref={repostBottomSheetRef}
                    snapPoints={snapPointsRepost}
                >
                    <View style={[styles.sheetOptionContainer, { backgroundColor: theme.secondary_background_color }]}>
                        <TouchableOpacity
                            onPress={() => onPressRepost()}
                            style={[styles.btnRepost, { backgroundColor: theme.secondary_background_color, }]}>
                            <FontAwesome5Icon
                                // onPress={()=>props.onRepost(post._id)}
                                name="retweet"
                                style={{ marginRight: 10 }}
                                size={20}
                                color={theme.text_color}
                            />
                            <Text style={{ color: theme.text_color }}>Repost</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => onPressQouteRepost()}
                            style={[styles.btnQouteRepost, { backgroundColor: theme.secondary_background_color, }]}>
                            <FontAwesome
                                // onPress={()=>props.onRepost(post._id)}
                                name="quote-left"
                                style={{ marginRight: 10 }}
                                size={20}
                                color={theme.text_color}
                            />
                            <Text style={{ color: theme.text_color }}>Repost with Qoute</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}
export default UserProfile
const styles = StyleSheet.create({
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
        width: "100%"
    },
    gestureContainer:
    {
        flex: 1
    },
    scrollContainer:
    {
        flex: 1,
    },
    stickyContainer:
    {
        elevation: 10,
        borderBottomWidth: 0.5
    },
    stickyRowContainer:
    {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        flex: 1,
        width: width,
        justifyContent: "space-between",
        alignItems: "center",
    },
    imageSticky:
    {
        height: scaledFont(30),
        width: scaledFont(30),
        borderRadius: scaledFont(30)
    },
    txtStickyFullname:
    {
        fontSize: scaledFont(18),
    },
    headerContainer:
    {
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'space-between'
    },
    userDetailsContainer:
    {
        padding: 20,
    },
    userDetailRowContainer:
    {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    txtUserFullname:
    {
        fontSize: scaledFont(20),
        fontWeight: "bold",
    },
    imgUserDetail:
    {
        height: scaledFont(70),
        width: scaledFont(70),
        borderRadius: scaledFont(70)
    },
    btnFollow:
    {
        marginTop: 20,
        width: '100%',
        padding: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    txtFollow:
    {
        fontSize: scaledFont(15),
        fontWeight: 'bold'
    },
    optionContainer:
    {
        //xmarginTop: 20,
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    btnThreads:
    {
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
    },
    btnReposts:
    {
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer:
    {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    txtEmpty:
    {
        fontSize: scaledFont(15),
    }
})
import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView, RefreshControl, Dimensions, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { placeholder_image } from '../../globals/asstes'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { CompositeNavigationProp, RouteProp, useNavigation, StackActions, useRoute, NavigationAction, NavigationProp, } from '@react-navigation/native'
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
import { twitter_blue } from '../../globals/Colors'
import { PAGE_SIZE } from '../../globals/constants'
import Replies from '../../components/feed/Replies'
import { ProfileStacktype } from '../../navigations/ProfileStack'
import { HomeStackParams } from '../../navigations/FeedStack'
import { RootStackType } from '../../navigations/RootStack'
import Loader from '../../components/global/Loader'
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
    type compositeUserProfileRootNavigation = CompositeNavigationProp<NavigationProp<HomeStackParams, "Home">, NavigationProp<RootStackType>>
    const [loading, setLoading] = useState(false)
    const [moreLoading, setMoreLoading] = useState(false)
    const [screenLoading, setScreenLoading] = useState(false)
    const route = useRoute<RouteProp<SearchStackParams, "UserProfile">>()
    const userId = route.params.userId
    const [posts, setPosts] = useState<Thread[]>([])
    const detailViewHeight = useRef<number>(0)
    const [lastOffset, setLastOffset] = useState<string | null>(null)
    const navigation = useNavigation<compositeUserProfileRootNavigation>()
    const [selectedSection, setSelectedSection] = useState<"Threads" | "Reposts">("Threads")
    const [postId, setPostId] = useState("")
    const { theme } = UseTheme()
    const replySnapPoints = useMemo(() => ['90%', "50%"], []);
    const snapPointsRepost = useMemo(() => ["30%"], []);
    const replyBottomSheetRef = useRef<BottomSheetModal>(null)
    const repostBottomSheetRef = useRef<BottomSheetModal>(null)
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
    const onChangeField = (field: "Threads" | "Reposts") => {
        setSelectedSection(field)
        getPosts(field)
    }
    const getPosts = async (field: "Threads" | "Reposts") => {
        try {
            setLoading(true)
            setPosts([])
            const response = await fetchPostsByUser({
                pageSize: PAGE_SIZE,
                post_type: field == "Reposts" ? "Repost" : "Thread",
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
                post_type: selectedSection == "Reposts" ? "Repost" : "Thread",
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
    const renderBioWithPressableHashtags = (bioText: string) => {
        const paragraphs = bioText.split('\n');

        return paragraphs.map((paragraph, paragraphIndex) => (
            <React.Fragment key={paragraphIndex}>
                <View style={{ flexDirection: 'row' }}>
                    {paragraph.split(/(\s+)/).map((word, wordIndex) => (
                        <React.Fragment key={wordIndex}>
                            {word.startsWith('#') ? (
                                <TouchableOpacity>
                                    <Text style={{ color: 'blue', fontWeight: 'bold' }}>{word} </Text>
                                </TouchableOpacity>
                            ) : (
                                <Text>{word} </Text>
                            )}
                        </React.Fragment>
                    ))}
                </View>
                {paragraphIndex < paragraphs.length - 1 && <Text>{'\n'}</Text>}
            </React.Fragment>
        ));
    };
    const toggleFollow = async () => {
        try {
            if (user.isFollowed) {
                const response = await unFollowUser(userId)
                setUser(prevUser => ({ ...prevUser, isFollowed: false,followers:prevUser.followers-1 }));
            }
            else {
                const response = await followUser(userId)
                setUser(prevUser => ({ ...prevUser, isFollowed: true,followers:prevUser.followers+1 }));
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
                if (index) {
                    const postThreads = [...posts]
                    postThreads[index].isLiked = true
                    setPosts(postThreads)
                }
            }
            else {
                const response = await unLikePost(postId)
                const index = posts.findIndex(post => post._id == postId)
                if (index) {
                    const postThreads = [...posts]
                    postThreads[index].isLiked = false
                    setPosts(postThreads)
                }
            }
        }
        catch (err) {

        }
    }
    const getUserAndPosts = async () => {
        await getUser()
        await getPosts("Threads")
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
                <ScrollView
                    nestedScrollEnabled
                    stickyHeaderHiddenOnScroll
                    stickyHeaderIndices={[2]}
                    scrollEventThrottle={10}
                    refreshControl={
                        <RefreshControl
                            tintColor={theme.text_color}
                            refreshing={loading}
                            onRefresh={() => getUserAndPosts()}
                        />
                    }
                    style={styles.scrollContainer}>

                    <View style={styles.headerContainer}>
                        <FontAwesome
                            onPress={() => navigation.goBack()}
                            name='angle-left'
                            size={25}
                            color={theme.text_color}
                        />
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
                        <Text
                            style={{ color: twitter_blue, flexWrap: "wrap" }}>{renderBioWithPressableHashtags(user.bio || "")}</Text>
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
                    <View style={{backgroundColor: theme.background_color}}>
                        <View style={styles.optionContainer}>
                            <TouchableOpacity
                                onPress={() => onChangeField("Threads")}
                                style={[styles.btnThreads, {
                                    borderBottomWidth: (selectedSection == "Threads") ? 1 : 0,
                                    borderColor: theme.text_color
                                }]}
                            >
                                <Text style={{
                                    fontSize: 15,
                                    color: theme.text_color
                                }}>Threads</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => onChangeField("Reposts")}
                                style={[styles.btnReposts, {
                                    borderBottomWidth: (selectedSection == "Reposts") ? 1 : 0,
                                    borderColor: theme.text_color
                                }]}
                            >
                                <Text style={{
                                    fontSize: 15,
                                    color: theme.text_color
                                }}>Reposts</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                    <View>
                        <FlatList
                            data={posts}
                            keyExtractor={item => item._id}
                            ListFooterComponent={() =>
                                moreLoading && <ActivityIndicator
                                    color={theme.text_color}
                                    size={"small"}
                                    animating
                                />
                            }
                            renderItem={({ item, index }) => renderPosts(item, index)}
                            onEndReached={() => getMorePosts()
                            }
                        />
                    </View>
                </ScrollView>
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
        height: 30,
        width: 30,
        borderRadius: 30
    },
    txtStickyFullname:
    {
        fontSize: 18,
    },
    headerContainer:
    {
        flexDirection: 'row',
        padding: 20
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
        fontSize: 20,
        fontWeight: "bold",
    },
    imgUserDetail:
    {
        height: 70,
        width: 70,
        borderRadius: 70
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
        fontSize: 15,
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
    }
})
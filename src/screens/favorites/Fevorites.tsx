import { View, Text, SafeAreaView, ScrollView, RefreshControl, StyleSheet } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import UseTheme from '../../globals/UseTheme'
import { TouchableOpacity } from 'react-native'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../redux/store'
import FollowingUser from '../../components/favorites/FollowingUser'
import { User } from '../../types/User'
import { deleteReplyAction, favoriteCreateRepostAction, favoritesLikeAction, favoritesUnlikeAction, getLikedPostsActions, getMoreLikedPostsActions, getMoreRepliedPostsAction, getMoreUserFollowingAction, getRepliedPostsAction, getUserFollowingAction } from '../../redux/actions/FavoriteActions'
import { Thread } from '../../types/Post'
import RepostItem from '../../components/feed/RepostItem'
import PostItem from '../../components/feed/PostItem'
import { CommentedPost } from '../../types/Comment'
import RepliedPost from '../../components/favorites/RepliedPost'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Loader from '../../components/global/Loader'
import Replies from '../../components/feed/Replies'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native'
import { FavoriteRootComposite } from '../../navigations/Types'
import { white } from '../../globals/Colors'
const Favorites = () => {
  const { theme } = UseTheme()
  const navigation = useNavigation<FavoriteRootComposite>()
  const loading = useSelector((state: RootState) => state.Favorite.loading)
  const error = useSelector((state: RootState) => state.Favorite.error)
  const users = useSelector((state: RootState) => state.Favorite.users)
  const suggestedUsers = useSelector((state: RootState) => state.Favorite.suggestedUsers)
  const screenLoading = useSelector((state: RootState) => state.Favorite.screeenLoading)
  const posts = useSelector((state: RootState) => state.Favorite.posts)
  const lastOffset =  useSelector((state: RootState) => state.Favorite.lastOffset)
  const [replyId, setReplyId] = useState<string>("")
  const [postId, setPostId] = useState<string>("")
  const repliedPosts = useSelector((state: RootState) => state.Favorite.repliedPosts)
  const threeDotsSnapPoints = useMemo(() => ['30%',], []);
  const replySnapPoints = useMemo(() => ['90%', "50%"], []);
  const snapPointsRepost = useMemo(() => ["30%"], []);
  const replyThreeDotsBottomSheetRef = useRef<BottomSheetModal>(null)
  const replyBottomSheetRef = useRef<BottomSheetModal>(null)
  const repostBottomSheetRef = useRef<BottomSheetModal>(null)
  const [selectedOption, setSelectedOption] = useState<"All" | "followings" | "Likes" | "Replies">("All")
  const dispatch = useAppDispatch()
  const onReplyThreeDots = (replyId: string) => {
    setReplyId(replyId)
    replyThreeDotsBottomSheetRef.current?.present()
  }
  const replyIconPress = (postId: string) => {
    console.log("reply")
    setPostId(postId)
    replyBottomSheetRef.current?.present()
  }
  const repostIconPress = (postId: string) => {
    setPostId(postId)
    repostBottomSheetRef.current?.present()
  }
  const onDeleteReply = (replyId: string) => {
    replyThreeDotsBottomSheetRef.current?.close()
    dispatch(deleteReplyAction({
      replyId: replyId
    }))
  }
  const toggleLike = (postId: string, step: string) => {
    if (step == "unlike") {
      dispatch(favoritesUnlikeAction({ post_type: "reply", postId: postId }))
    }
    else {
      dispatch(favoritesLikeAction({ post_type: "reply", postId: postId }))
    }
  }
  const renderUsers = (item: User, index: number) => {
    return (
      <FollowingUser
        user={item}
        onPress={() => console.log("pressed")}
      />
    )
  }
  const renderPosts = (item: Thread, index: number) => {
    return (
      item.isRepost && item.Repost
        ?
        <RepostItem
          onLikeToggle={(postId, step) => toggleLike(postId, step)}
          onPressComment={(postId) => replyIconPress(postId)}
          onPressNavigate={() => console.log("navig")}
          onRepost={() => console.log("repose")}
          post={item}
        /> :
        <PostItem
          onLikeToggle={(postId, step) => toggleLike(postId, step)}
          onPressComment={(postId) => replyIconPress(postId)}
          onPressNavigate={() => console.log("navig")}
          onRepost={() => console.log("repose")}
          post={item}
        />
    )
  }
  const onPressRepost = () => {
    repostBottomSheetRef.current?.close()
    dispatch(favoriteCreateRepostAction({
      postId: postId
    }))
  }
  const onPressQouteRepost = () => {
    const thread = (selectedOption === "Replies") ?
      repliedPosts.find(replyPost => replyPost.post._id == postId)?.post
      : posts.find(post => post._id == postId)
    repostBottomSheetRef.current?.close()
    if (thread)
      navigation.navigate("QoutePost", {
        Thread: thread
      })
  }

  const renderReplies = (item: CommentedPost, index: number) => {
    return (
      <RepliedPost
        onRepostIcon={(postId) => repostIconPress(postId)}
        onPressComment={(postId) => replyIconPress(postId)}
        onReplyThreeDots={(replyId) => onReplyThreeDots(replyId)}
        toggleLike={(postId, step) => toggleLike(postId, step)}
        commentPost={item}
        key={item._id}
      />
    )
  }
  const getLikedPosts = async () => {
    dispatch(getLikedPostsActions(""))
  }
  const getRepliedPosts = async () => {
    dispatch(getRepliedPostsAction(""))
  }
  const getMoreRepliesPosts = async () => {
    dispatch(getMoreRepliedPostsAction(""))
  }
  const getFollowingUsers = async () => {
    dispatch(getUserFollowingAction(""))
  }
  useEffect(() => {
    if (selectedOption == "Likes")
      getLikedPosts()
    else if (selectedOption == "Replies")
      getRepliedPosts()
    else if (selectedOption == "followings")
      getFollowingUsers()
  }, [selectedOption])
  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: theme.background_color
      }}>
        {screenLoading && <Loader />}
        <View style={styles.optionRowContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <TouchableOpacity
              onPress={() => setSelectedOption("All")}
              style={[styles.btnSelectionOption, {
                borderColor: theme.placeholder_color,
                borderWidth: (selectedOption == "All") ? 0 : 1,
                backgroundColor: selectedOption == "All" ? theme.primary_color : theme.background_color,
              }]}>
              <Text style={{
                fontWeight: "bold",
                color: selectedOption == "All" ? white : theme.text_color
              }}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedOption("followings")}
              style={[styles.btnSelectionOption, {
                borderColor: theme.placeholder_color,
                borderWidth: (selectedOption == "followings") ? 0 : 1,
                backgroundColor: selectedOption == "followings" ? theme.primary_color : theme.background_color,
              }]}>
              <Text style={{
                fontWeight: "bold",
                color: selectedOption == "followings" ? white : theme.text_color
              }}>Followings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedOption("Replies")}
              style={[styles.btnSelectionOption, {
                borderColor: theme.placeholder_color,
                borderWidth: (selectedOption == "Replies") ? 0 : 1,
                backgroundColor: selectedOption == "Replies" ? theme.primary_color : theme.background_color,
              }]}>
              <Text style={{
                fontWeight: "bold",
                color: selectedOption == "Replies" ?white : theme.text_color
              }}>Replies</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedOption("Likes")}
              style={[styles.btnSelectionOption, {
                borderColor: theme.placeholder_color,
                borderWidth: (selectedOption == "Likes") ? 0 : 1,
                backgroundColor: selectedOption == "Likes" ? theme.primary_color : theme.background_color,
              }]}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: selectedOption == "Likes" ? white : theme.text_color
                }}>Liked</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {
          selectedOption == "All" &&
          <FlatList
            refreshControl={<RefreshControl
              tintColor={theme.text_color}
              refreshing={loading}
            />}
            ListEmptyComponent={() => (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{
                  color: theme.text_color
                }}>suggestions are coming Soon !!</Text>
              </View>
            )}
            style={{ flex: 1 }}
            data={suggestedUsers}
            keyExtractor={item => item._id}
            renderItem={({ item, index }) => <Text>{item.username}</Text>}
          />
        }
        {selectedOption == "followings" && <FlatList
          refreshControl={<RefreshControl
            tintColor={theme.text_color}
            refreshing={loading}
            onRefresh={() => getFollowingUsers()}
          />}
          data={users}
          onEndReachedThreshold={0.3}
          onEndReached={() =>lastOffset && dispatch(getMoreUserFollowingAction(""))}
          keyExtractor={item => item._id}
          renderItem={({ item, index }) => renderUsers(item, index)}
        />
        }
        {
          selectedOption == "Likes" &&
          <FlatList
            refreshControl={<RefreshControl
              tintColor={theme.text_color}
              refreshing={loading}
              onRefresh={() => getLikedPosts()}
            />}
            onEndReachedThreshold={0.3}
            onEndReached={() =>lastOffset && dispatch(getMoreLikedPostsActions(""))}
            data={posts}
            keyExtractor={item => item._id}
            renderItem={({ item, index }) => renderPosts(item, index)}
          />
        }
        {
          selectedOption == "Replies" &&
          <FlatList
            style={{
              flex: 1
            }}
            refreshControl={<RefreshControl
              tintColor={theme.text_color}
              refreshing={loading}
              onRefresh={() => getRepliedPosts()}
            />}
            ListEmptyComponent={() =>
              !loading &&
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignContent: "center"
              }}>
                <Text>No replies created by you</Text>
              </View>
            }
            onEndReachedThreshold={0.3}
            onEndReached={() =>lastOffset && getMoreRepliesPosts()}
            data={repliedPosts}
            keyExtractor={item => item._id}
            renderItem={({ item, index }) => renderReplies(item, index)}
          />
        }
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={replyThreeDotsBottomSheetRef}
            snapPoints={threeDotsSnapPoints}
            index={0}
            backdropComponent={(props) => (
              <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
            )}
            handleStyle={[styles.handleRepost, {
              backgroundColor: theme.secondary_background_color,
              borderColor: theme.text_color
            }]}
            handleIndicatorStyle={{ borderColor: theme.text_color, borderWidth: 2 }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.3)',
                justifyContent: "flex-end",
                alignItems: "center"
              }}>
              <View style={{
                width: "100%",
                backgroundColor: theme.background_color,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 10,

              }} >

                <View style={{
                  justifyContent: 'center',
                  alignItems: "center",
                  marginVertical: 10
                }}>
                  <TouchableOpacity
                    onPress={() => onDeleteReply(replyId)}
                    style={{
                      width: "100%",
                      borderRadius: 15,
                      //  marginTop:20,
                      backgroundColor: theme.secondary_color,
                      padding: 20
                    }}
                  >
                    <Text style={{
                      color: "red",
                      fontWeight: "bold",
                      fontSize: 15
                    }}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      replyThreeDotsBottomSheetRef.current?.close()
                    }}
                    style={{
                      width: "100%",
                      borderRadius: 15,
                      marginVertical: 10,
                      backgroundColor: theme.secondary_color,
                      padding: 20
                    }}
                  >
                    <Text style={{
                      color: theme.text_color,
                      fontWeight: "bold",
                      fontSize: 15,

                    }}>Cancel</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </BottomSheetModal>
          <BottomSheetModal
            ref={replyBottomSheetRef}
            snapPoints={replySnapPoints}
            index={0}
            backdropComponent={(props) => (
              <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
            )}
            handleStyle={[styles.handleRepost, {
              backgroundColor: theme.secondary_background_color,
              borderColor: theme.text_color
            }]}
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
      </SafeAreaView>
    </GestureHandlerRootView>

  )
}

export default Favorites
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
  btnSelectionOption:
  {
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 20,
    paddingHorizontal: 20,
  },
  optionRowContainer:
  {
    flexDirection: 'row',
    padding: 20
  },
  gestureContainer:
  {
    flex: 1
  }
})